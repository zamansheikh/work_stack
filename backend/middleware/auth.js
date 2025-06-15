const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided or invalid format.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token or user not active.'
                });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication.'
        });
    }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required.'
        });
    }

    next();
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.userId).select('-password');

                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (jwtError) {
                // Token invalid, but continue without user
                console.log('Invalid token in optional auth:', jwtError.message);
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next(); // Continue without authentication
    }
};

module.exports = {
    authenticate,
    requireAdmin,
    optionalAuth
};
