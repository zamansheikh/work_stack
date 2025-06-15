const express = require('express');
const Feature = require('../models/Feature');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { featureValidation, checkValidation } = require('../middleware/validation');
const { deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// @route   GET /api/features
// @desc    Get all features with optional filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            search,
            sortBy = 'updatedAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (priority && priority !== 'all') {
            filter.priority = priority;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const features = await Feature.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Feature.countDocuments(filter);

        // Calculate pagination info
        const totalPages = Math.ceil(total / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPrevPage = parseInt(page) > 1;

        res.json({
            success: true,
            data: {
                features,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalFeatures: total,
                    hasNextPage,
                    hasPrevPage,
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get features error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching features'
        });
    }
});

// @route   GET /api/features/stats
// @desc    Get features statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const stats = await Feature.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Feature.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Feature.countDocuments();

        // Format stats
        const statusStats = {
            total,
            planned: 0,
            'in-progress': 0,
            completed: 0,
            'on-hold': 0
        };

        stats.forEach(stat => {
            statusStats[stat._id] = stat.count;
        });

        const priorityStatsFormatted = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0
        };

        priorityStats.forEach(stat => {
            priorityStatsFormatted[stat._id] = stat.count;
        });

        res.json({
            success: true,
            data: {
                status: statusStats,
                priority: priorityStatsFormatted
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

// @route   GET /api/features/:id
// @desc    Get single feature by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        res.json({
            success: true,
            data: {
                feature
            }
        });

    } catch (error) {
        console.error('Get feature error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid feature ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching feature'
        });
    }
});

// @route   POST /api/features
// @desc    Create new feature
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, featureValidation, checkValidation, async (req, res) => {
    try {
        const featureData = {
            ...req.body,
            author: req.body.author || req.user.name || 'Development Team'
        };

        const feature = new Feature(featureData);
        await feature.save();

        res.status(201).json({
            success: true,
            message: 'Feature created successfully',
            data: {
                feature
            }
        });

    } catch (error) {
        console.error('Create feature error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating feature'
        });
    }
});

// @route   PUT /api/features/:id
// @desc    Update feature
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, featureValidation, checkValidation, async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        // Update feature
        Object.assign(feature, req.body);
        await feature.save();

        res.json({
            success: true,
            message: 'Feature updated successfully',
            data: {
                feature
            }
        });

    } catch (error) {
        console.error('Update feature error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid feature ID'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating feature'
        });
    }
});

// @route   DELETE /api/features/:id
// @desc    Delete feature
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        // Delete associated files from Cloudinary
        if (feature.attachments && feature.attachments.length > 0) {
            for (const attachment of feature.attachments) {
                try {
                    await deleteFromCloudinary(attachment.publicId);
                } catch (cloudinaryError) {
                    console.error('Error deleting file from Cloudinary:', cloudinaryError);
                    // Continue with deletion even if file removal fails
                }
            }
        }

        await Feature.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Feature deleted successfully'
        });

    } catch (error) {
        console.error('Delete feature error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid feature ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting feature'
        });
    }
});

// @route   DELETE /api/features/:id/attachments/:attachmentId
// @desc    Delete specific attachment from feature
// @access  Private (Admin only)
router.delete('/:id/attachments/:attachmentId', authenticate, requireAdmin, async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        const attachment = feature.attachments.id(req.params.attachmentId);

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found'
            });
        }

        // Delete from Cloudinary
        try {
            await deleteFromCloudinary(attachment.publicId);
        } catch (cloudinaryError) {
            console.error('Error deleting file from Cloudinary:', cloudinaryError);
            // Continue with database removal even if Cloudinary deletion fails
        }

        // Remove from database
        feature.attachments.pull(req.params.attachmentId);
        await feature.save();

        res.json({
            success: true,
            message: 'Attachment deleted successfully'
        });

    } catch (error) {
        console.error('Delete attachment error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting attachment'
        });
    }
});

module.exports = router;
