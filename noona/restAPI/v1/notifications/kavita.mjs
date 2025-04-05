// /noona/restAPI/v1/notifications/kavitaHandler.mjs

import express from 'express';
import getIds from './getIds.mjs';
import postIds from './postIds.mjs';

const router = express.Router();

router.use('/', getIds);
router.use('/', postIds);

export default router;
