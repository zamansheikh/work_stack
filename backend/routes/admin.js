const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
} = require('../controllers/userController');
const { protect, superAdminOnly } = require('../middleware/auth');

// All routes require super admin access
router.use(protect);
router.use(superAdminOnly);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Super Admin only
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:userId
// @desc    Get user by ID
// @access  Super Admin only
router.get('/users/:userId', getUserById);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Super Admin only
router.post('/users', createUser);

// @route   PUT /api/admin/users/:userId
// @desc    Update user
// @access  Super Admin only
router.put('/users/:userId', updateUser);

// @route   PATCH /api/admin/users/:userId/toggle
// @desc    Enable/disable user
// @access  Super Admin only
router.patch('/users/:userId/toggle', toggleUserStatus);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user
// @access  Super Admin only
router.delete('/users/:userId', deleteUser);

module.exports = router;