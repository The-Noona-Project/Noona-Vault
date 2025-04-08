// /noona/restAPI/server.mjs

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { printResult } from '../logger/logUtils.mjs';
import { mountRoutesV2 } from './v2/routeManagerV2.mjs';

const app = express();
const PORT = process.env.PORT || 3130;

// 🌐 Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 🧩 Mount all /v2 routes
await mountRoutesV2(app);

// 🚀 Launch
app.listen(PORT, () => {
    printResult(`✔ ✅ Vault API listening on port ${PORT}`);
});
