export async function validateAndRouteRequest(req) {
    const headers = req.headers || {};
    const { fromto, jwt, time } = headers;
    const { db, target, action, payload } = req.body || {};

    if (!fromto || !jwt || !time) {
        return {
            status: 400,
            body: { success: false, msg: 'Missing required headers' }
        };
    }

    if (!db || !target || !action) {
        return {
            status: 400,
            body: { success: false, msg: 'Missing required body fields' }
        };
    }

    try {
        const devToken = makeToken({ from: 'portal-vault' });
        if (jwt !== devToken) {
            return {
                status: 401,
                body: { success: false, msg: 'Invalid JWT token' }
            };
        }

        switch (db.toLowerCase()) {
            case 'mongo':
                return await handleMongoAction({ action, target, payload });

            default:
                return {
                    status: 400,
                    body: { success: false, msg: `Unsupported DB: ${db}` }
                };
        }
    } catch (error) {
        console.error('[Auth] Token validation error:', error.message);
        return {
            status: 500,
            body: { success: false, msg: 'Error during authentication' }
        };
    }
} 