// /database/milvus/milvus.mjs

import chalk from 'chalk';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

/**
 * Initializes Milvus vector database connection.
 * Handles low-level gRPC errors and malformed responses.
 *
 * @returns {Promise<boolean>} - true if successful, false otherwise
 */
export default async function initMilvus() {
    const address = process.env.MILVUS_ADDRESS || 'localhost:19530';

    console.log(chalk.cyan(`[Milvus] Attempting to connect to ${address}...`));

    try {
        const client = new MilvusClient({ address });

        let response;
        try {
            response = await client.showCollections();
        } catch (error) {
            console.error(chalk.red(`[Milvus] gRPC call failed.`));
            console.error(chalk.gray(`[Milvus] Details: ${error?.details || error?.message || 'Unknown'}`));
            return false;
        }

        const error_code = response?.status?.error_code || response?.error_code;
        const reason = response?.status?.reason || response?.reason;
        const data = response?.data;

        if (error_code && error_code !== 'Success' && error_code !== 0) {
            console.warn(chalk.yellow(`[Milvus] Error code: ${error_code}`));
            console.warn(chalk.gray(`[Milvus] Reason: ${reason || 'Unknown'}`));
            console.warn(chalk.gray(`[Milvus] Raw response:`), JSON.stringify(response, null, 2));
            return false;
        }

        console.log(chalk.green(`[Milvus] Connected to ${address}`));

        const collections = data?.map(c => c.name).join(', ') || 'None';
        console.log(chalk.green(`[Milvus] Collections:`), collections);

        global.noonaMilvus = client;
        return true;
    } catch (err) {
        console.error(chalk.red(`[Milvus] ❌ Connection failed.`));
        console.error(chalk.gray(`[Milvus] Reason: ${err?.message || 'Unknown'}`));
        return false;
    }
}
