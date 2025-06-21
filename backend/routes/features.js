const express = require('express');
const router = express.Router();
const {
    getAllFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature,
    getFeatureStats
} = require('../controllers/featureController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/features
// @desc    Get all features (public)
// @access  Public
router.get('/', getAllFeatures);

// @route   GET /api/features/stats
// @desc    Get feature statistics
// @access  Public
router.get('/stats', getFeatureStats);

// @route   GET /api/features/:id
// @desc    Get single feature
// @access  Public
router.get('/:id', getFeatureById);

// @route   POST /api/features
// @desc    Create new feature
// @access  Private (Admin only)
router.post('/', protect, adminOnly, createFeature);

// @route   PUT /api/features/:id
// @desc    Update feature
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, updateFeature);

// @route   DELETE /api/features/:id
// @desc    Delete feature
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, deleteFeature);

module.exports = router;
