const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token and check if enabled
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!user.enabled) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is disabled'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

// Admin only access
const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

// Super Admin only access
const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin privileges required.'
        });
    }
};

module.exports = {
    protect,
    adminOnly,
    superAdminOnly
};
