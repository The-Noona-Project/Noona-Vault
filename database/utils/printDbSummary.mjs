// ✅ /database/utils/printDbSummary.mjs

import chalk from 'chalk';
import { table } from 'table';

/**
 * Truncates long strings in the middle with ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function truncateMiddle(str = '', max = 30) {
    if (str.length <= max) return str;
    return str.slice(0, 14) + '…' + str.slice(-15);
}

/**
 * Prints a formatted database initialization summary table.
 *
 * @param {Array<{ name: string, status: boolean, info: string }>} dbResults
 */
export function printDbSummary(dbResults) {
    console.log('');
    console.log(chalk.cyan('[Noona-Vault] 🔌 Database Initialization Summary\n'));

    const rows = [
        ['Database', 'Connection Info', 'Status'],
        ...dbResults.map(db => [
            db.name,
            truncateMiddle(db.info),
            db.status ? chalk.green('🟢 Connected') : chalk.red('🔴 Failed')
        ])
    ];

    const config = {
        border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,
            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,
            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,
            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
        },
        columns: {
            0: { width: 12 },
            1: { width: 32 },
            2: { width: 15 }
        }
    };

    console.log(table(rows, config));

    const successCount = dbResults.filter(d => d.status).length;
    const total = dbResults.length;

    if (successCount === total) {
        console.log(chalk.green(`🧠  Database grid online. All systems nominal.`));
    } else {
        console.log(chalk.red(`⚠️  ${total - successCount} database(s) failed to initialize.`));
    }

    console.log('');
}
