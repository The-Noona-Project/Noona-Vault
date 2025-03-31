// /noona/restAPI/v1/crud/crudMariadb.mjs

import express from 'express';
import { getMariaDBConnection } from '../../../../database/mariadb/getFromMariadb.mjs';
import { printError } from '../../../logger/logUtils.mjs';

const router = express.Router();

/**
 * Helper function to build a WHERE clause from a filter object.
 *
 * @param {object} filter - Object with key-value pairs to filter by.
 * @returns {object} - { clause: string, values: Array } for parameterized query.
 */
function buildWhereClause(filter = {}) {
    const keys = Object.keys(filter);
    if (keys.length === 0) return { clause: '', values: [] };
    const clause = keys.map(key => `\`${key}\` = ?`).join(' AND ');
    const values = keys.map(key => filter[key]);
    return { clause: `WHERE ${clause}`, values };
}

/**
 * Handles CRUD operations for MariaDB using the shared connection.
 *
 * Route: POST /v1/crud/mariadb/:table/:action
 *
 * Headers:
 *   - fromto: string (required)
 *   - time: string (required)
 *
 * Body:
 *   - For create: { data: { ... } }
 *   - For read: { filter: { ... } }
 *   - For update: { filter: { ... }, data: { ... } }
 *   - For delete: { filter: { ... } }
 */
router.post('/:table/:action', async (req, res) => {
    const { table, action } = req.params;
    const { fromto, time } = req.headers;
    const { data, filter } = req.body || {};

    if (!fromto || !time) {
        return res.status(400).json({ success: false, msg: 'Missing required headers (fromto, time)' });
    }
    if (!table || !action) {
        return res.status(400).json({ success: false, msg: 'Missing table or action in route' });
    }

    const connection = await getMariaDBConnection();
    if (!connection) {
        printError('❌ MariaDB connection not available');
        return res.status(503).json({ success: false, msg: 'MariaDB connection unavailable' });
    }

    try {
        let result;
        // Example approach: Validate table name
        const allowedTables = ['users', 'orders', '...', 'someSafeTable'];
        if (!allowedTables.includes(table)) {
            return res.status(400).json({ success: false, msg: 'Invalid table name' });
        }

        switch (action?.toLowerCase?.()) {
            case 'create': {
                if (!data || typeof data !== 'object') {
                    return res.status(400).json({ success: false, msg: 'Missing or invalid "data" for create' });
                }
                const [queryResult] = await connection.execute(
                    `INSERT INTO \`${table}\` SET ?`,
                    [data]
                );
                return res.status(201).json({ success: true, insertedId: queryResult.insertId });
            }

            case 'read': {
                const { clause, values } = buildWhereClause(filter || {});
                const query = `SELECT * FROM \`${table}\` ${clause}`;
                const [rows] = await connection.execute(query, values);
                return res.status(200).json({ success: true, count: rows.length, results: rows });
            }

            case 'update': {
                if (!filter || !data) {
                    return res.status(400).json({ success: false, msg: 'Missing "filter" or "data" for update' });
                }
                const { clause, values } = buildWhereClause(filter);
                if (!clause) {
                    return res.status(400).json({ success: false, msg: 'Empty filter provided for update' });
                }
                const [queryResult] = await connection.execute(
                    `UPDATE \`${table}\` SET ? ${clause}`,
                    [data, ...values]
                );
                return res.status(200).json({ success: true, affectedRows: queryResult.affectedRows });
            }

            case 'delete': {
                if (!filter || typeof filter !== 'object') {
                    return res.status(400).json({ success: false, msg: 'Missing or invalid "filter" for delete' });
                }
                const { clause, values } = buildWhereClause(filter);
                if (!clause) {
                    return res.status(400).json({ success: false, msg: 'Empty filter provided for delete' });
                }
                const [queryResult] = await connection.execute(
                    `DELETE FROM \`${table}\` ${clause}`,
                    values
                );
                return res.status(200).json({ success: true, affectedRows: queryResult.affectedRows });
            }

            default:
                return res.status(400).json({ success: false, msg: `Unsupported action: ${action}` });
        }
    } catch (err) {
        printError(`[MariaDB] ${action.toUpperCase()} failed on ${table}: ${err.message}`);
        return res.status(500).json({ success: false, msg: `MariaDB ${action} operation failed` });
    }
});

export default router;
