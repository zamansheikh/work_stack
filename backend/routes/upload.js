const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const Feature = require('../models/Feature');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// @route   POST /api/upload/feature/:featureId/attachments
// @desc    Upload attachments for a feature
// @access  Private (Admin only)
router.post('/feature/:featureId/attachments', protect, adminOnly, upload.array('attachments', 5), async (req, res) => {
    try {
        const { featureId } = req.params;

        // Check if feature exists
        const feature = await Feature.findById(featureId);
        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        // Process uploaded files
        const attachments = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            uploadedAt: new Date()
        }));

        // Add attachments to feature
        feature.attachments.push(...attachments);
        await feature.save();

        res.json({
            success: true,
            message: `${attachments.length} file(s) uploaded successfully`,
            data: {
                attachments: attachments
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        if (error.message === 'Invalid file type') {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Allowed types: jpeg, jpg, png, gif, pdf, doc, docx, txt'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error during file upload'
        });
    }
});

// @route   DELETE /api/upload/feature/:featureId/attachments/:attachmentId
// @desc    Delete attachment from feature
// @access  Private (Admin only)
router.delete('/feature/:featureId/attachments/:attachmentId', protect, adminOnly, async (req, res) => {
    try {
        const { featureId, attachmentId } = req.params;

        const feature = await Feature.findById(featureId);
        if (!feature) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }

        // Remove attachment from feature
        feature.attachments = feature.attachments.filter(
            attachment => attachment._id.toString() !== attachmentId
        );

        await feature.save();

        res.json({
            success: true,
            message: 'Attachment deleted successfully'
        });
    } catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting attachment'
        });
    }
});

module.exports = router;
