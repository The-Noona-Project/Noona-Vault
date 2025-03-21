// /noona/restAPI/v1/crud/router.mjs
import express from 'express';
import { validateAndRouteRequest } from './validateAndRoute.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
    const { status, body } = await validateAndRouteRequest(req);
    res.status(status).json(body);
});

export default function (app) {
    app.use('/v1/crud', router);
}
