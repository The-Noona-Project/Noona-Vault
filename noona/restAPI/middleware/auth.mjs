import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens in requests
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication token is required' 
        });
    }
    
    try {
        const secret = process.env.JWT_SECRET || 'super-secret-key';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
} 