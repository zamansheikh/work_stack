const Feature = require('../models/Feature');

// Get all features with filtering, searching, and pagination
const getAllFeatures = async (req, res) => {
    try {
        const { status, priority, search, page = 1, limit = 10 } = req.query;

        // Build query object
        const query = {};

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get features with pagination
        const features = await Feature.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        // const totalFeatures = await Feature.countDocuments(query);
        const totalFeatures = await Feature.countDocuments();
        const totalCompleted = await Feature.countDocuments({ status: 'completed' });
        const totalInProgress = await Feature.countDocuments({ status: 'in-progress' });
        const totalPlanned = await Feature.countDocuments({ status: 'planned' });
        const totalOnHold = await Feature.countDocuments({ status: 'on-hold' });
        const totalCancelled = await Feature.countDocuments({ status: 'cancelled' });
        const totalPages = Math.ceil(totalFeatures / parseInt(limit));

        res.json({
            success: true,
            data: {
                features,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalFeatures,
                    totalCompleted,
                    totalInProgress,
                    totalPlanned,
                    totalOnHold,
                    totalCancelled,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all features error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching features'
        });
    }
};

// Get single feature by ID
const getFeatureById = async (req, res) => {
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
            data: { feature }
        });
    } catch (error) {
        console.error('Get feature by ID error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching feature'
        });
    }
};

// Create new feature
const createFeature = async (req, res) => {
    try {
        const {
            name,
            description,
            purpose,
            implementation,
            technicalDetails,
            status = 'planned',
            priority = 'medium',
            tags = [],
            author
        } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }

        // Create feature
        const feature = new Feature({
            name,
            description,
            purpose,
            implementation,
            technicalDetails,
            status,
            priority,
            tags,
            author,
            attachments: []
        });

        await feature.save();

        res.status(201).json({
            success: true,
            message: 'Feature created successfully',
            data: { feature }
        });
    } catch (error) {
        console.error('Create feature error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating feature'
        });
    }
};

// Update feature
const updateFeature = async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        // Update fields
        const updateFields = [
            'name', 'description', 'purpose', 'implementation',
            'technicalDetails', 'status', 'priority', 'tags', 'author'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                feature[field] = req.body[field];
            }
        });

        await feature.save();

        res.json({
            success: true,
            message: 'Feature updated successfully',
            data: { feature }
        });
    } catch (error) {
        console.error('Update feature error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while updating feature'
        });
    }
};

// Delete feature
const deleteFeature = async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id);

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        await Feature.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Feature deleted successfully'
        });
    } catch (error) {
        console.error('Delete feature error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while deleting feature'
        });
    }
};

// Get feature statistics
const getFeatureStats = async (req, res) => {
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

        const totalFeatures = await Feature.countDocuments();

        res.json({
            success: true,
            data: {
                totalFeatures,
                statusStats: stats,
                priorityStats
            }
        });
    } catch (error) {
        console.error('Get feature stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};

module.exports = {
    getAllFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature,
    getFeatureStats
};