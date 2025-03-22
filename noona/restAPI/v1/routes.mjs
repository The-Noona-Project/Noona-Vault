import express from 'express';
import crudRouter from './crud/router.mjs';
import systemRoutes from './system/routes.mjs';
import notificationRoutes from './notifications/routes.mjs';

export default function(app) {
    const router = express.Router();

    router.use('/crud', crudRouter);
    router.use('/system', systemRoutes);
    router.use('/notifications', notificationRoutes);

    app.use('/v1', router);
} 