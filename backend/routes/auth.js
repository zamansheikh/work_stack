const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginValidation, checkValidation } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', loginValidation, checkValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });

        // If no user exists and this is the admin email, create admin user
        if (!user && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
            user = new User({
                email: process.env.ADMIN_EMAIL.toLowerCase(),
                password: process.env.ADMIN_PASSWORD,
                role: 'admin',
                name: 'Super Admin'
            });
            await user.save();
            console.log('✅ Admin user created');
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create JWT token
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
    try {
        // In a more complex setup, you might maintain a blacklist of tokens
        // For now, just confirm logout (client should remove token)
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post('/verify-token', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Token is valid',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during token verification'
        });
    }
});

module.exports = router;
