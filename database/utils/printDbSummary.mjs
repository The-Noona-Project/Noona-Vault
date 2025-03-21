// /utils/printDbSummary.mjs

import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * @param {Array<{
 *   name: string,
 *   status: boolean,
 *   info: string
 * }>} dbResults
 */
export function printDbSummary(dbResults) {
    console.log('');
    console.log(chalk.cyan('[Noona-Vault] 🔌 Database Initialization Summary\n'));

    const table = new Table({
        head: ['Database', 'Connection Info', 'Status'],
        colWidths: [12, 30, 15]
    });

    for (const db of dbResults) {
        table.push([
            db.name,
            db.info,
            db.status ? chalk.green('🟢 Connected') : chalk.red('🔴 Failed')
        ]);
    }

    console.log(table.toString());

    const successCount = dbResults.filter(d => d.status).length;
    const total = dbResults.length;

    console.log('');
    if (successCount === total) {
        console.log(chalk.green(`✅ All ${total}/${total} databases initialized.`));
    } else {
        console.log(chalk.yellow(`⚠️  ${successCount}/${total} databases initialized.`));
    }
    console.log('');
}
