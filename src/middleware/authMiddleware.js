const jwt = require('jsonwebtoken');

const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            const secret = process.env.JWT_SECRET || 'fallback_secret';
            let headerToken = null;
            let cookieToken = null;

            // Extract token from Authorization header if provided
            if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
                const parts = request.headers.authorization.split(' ');
                if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined') {
                    headerToken = parts[1];
                }
            }

            // Extract token from cookie if provided
            if (request.cookies?.jwtToken && request.cookies.jwtToken !== 'null' && request.cookies.jwtToken !== 'undefined') {
                cookieToken = request.cookies.jwtToken;
            }

            // Try header token first
            if (headerToken) {
                try {
                    const user = jwt.verify(headerToken, secret);
                    request.user = user;
                    return next();
                } catch (err) {
                    // Header token failed, fall through to cookie attempt
                }
            }

            // Try cookie token if header token failed or was missing
            if (cookieToken) {
                try {
                    const user = jwt.verify(cookieToken, secret);
                    request.user = user;
                    return next();
                } catch (err) {
                    // Cookie token failed
                }
            }

            return response.status(401).json({
                error: 'Unauthorized access'
            });

        } catch (error) {
            console.error('Auth middleware error:', error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    }
};

module.exports = authMiddleware;
