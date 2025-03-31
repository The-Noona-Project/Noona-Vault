// ✅ /noona/logger/printDbSummary.mjs

import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * Displays a visual summary of database connection statuses.
 *
 * @param {Array<{ name: string, status: boolean, info: string }>} dbs
 */
export function printDbSummary(dbs = []) {
    const table = new Table({
        head: [
            chalk.bold.cyan('Database'),
            chalk.bold.cyan('Status'),
            chalk.bold.cyan('Info')
        ],
        colWidths: [20, 12, 50],
        style: {
            head: [], border: []
        }
    });

    dbs.forEach(({ name, status, info }) => {
        table.push([
            chalk.white(name),
            status ? chalk.green('Online') : chalk.red('Failed'),
            chalk.gray(info)
        ]);
    });

    console.log('');
    console.log(chalk.bold('📊 Database Connection Summary'));
    console.log(table.toString());
}
