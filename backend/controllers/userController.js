const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users (Super Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
            .sort({ createdAt: -1 })
            .select('name email role enabled createdAt updatedAt lastLogin');

        res.json({
            success: true,
            data: {
                users,
                totalUsers: users.length
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};

// Get single user details (Super Admin only)
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId, '-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user'
        });
    }
};

// Create new user (Super Admin only)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'admin' } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            enabled: true
        });

        await newUser.save();

        // Return user without password
        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            enabled: newUser.enabled,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user: userResponse }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating user'
        });
    }
};

// Update user (Super Admin only)
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it's unique
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        // Return updated user without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            enabled: user.enabled,
            updatedAt: user.updatedAt
        };

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user: userResponse }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user'
        });
    }
};

// Toggle user enable/disable status (Super Admin only)
const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Enabled status must be a boolean value'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent super admin from disabling themselves
        if (user._id.toString() === req.user.id && !enabled) {
            return res.status(400).json({
                success: false,
                message: 'Cannot disable your own account'
            });
        }

        user.enabled = enabled;
        await user.save();

        res.json({
            success: true,
            message: `User ${enabled ? 'enabled' : 'disabled'} successfully`,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    enabled: user.enabled
                }
            }
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user status'
        });
    }
};

// Delete user (Super Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent super admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
};