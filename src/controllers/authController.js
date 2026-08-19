const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/'
    };
};

const authController = {
    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;
            await authService.register(name, email, password);
            
            // Log in user automatically upon registration
            const { user, token } = await authService.login(email, password);
            
            res.cookie('jwtToken', token, getCookieOptions());

            res.status(201).json({
                message: 'User registered successfully',
                user: { name: user.name, email: user.email },
                token: token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);
            
            res.cookie('jwtToken', token, getCookieOptions());

            res.status(200).json({
                message: 'User authenticated',
                user: { name: user.name, email: user.email },
                token: token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('jwtToken', getCookieOptions());
        res.status(200).json({ message: 'User logged out successfully' });
    }
};

module.exports = authController;
