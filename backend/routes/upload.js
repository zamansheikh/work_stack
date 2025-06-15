const express = require('express');
const Feature = require('../models/Feature');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload, deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// @route   POST /api/upload/feature/:id/attachments
// @desc    Upload attachments for a feature
// @access  Private (Admin only)
router.post('/feature/:id/attachments', authenticate, requireAdmin, (req, res) => {
    // Use multer middleware for multiple file uploads
    upload.array('attachments', 5)(req, res, async (err) => {
        try {
            if (err) {
                console.error('Upload error:', err);

                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 10MB per file.'
                    });
                }

                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files. Maximum 5 files per upload.'
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message || 'Error uploading files'
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
            }

            // Find the feature
            const feature = await Feature.findById(req.params.id);

            if (!feature) {
                // Clean up uploaded files if feature not found
                for (const file of req.files) {
                    try {
                        await deleteFromCloudinary(file.public_id);
                    } catch (cleanupError) {
                        console.error('Error cleaning up file:', cleanupError);
                    }
                }

                return res.status(404).json({
                    success: false,
                    message: 'Feature not found'
                });
            }

            // Process uploaded files
            const newAttachments = req.files.map(file => ({
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                url: file.secure_url,
                publicId: file.public_id
            }));

            // Add attachments to feature
            feature.attachments.push(...newAttachments);
            await feature.save();

            res.json({
                success: true,
                message: `${req.files.length} file(s) uploaded successfully`,
                data: {
                    uploadedFiles: newAttachments,
                    feature
                }
            });

        } catch (error) {
            console.error('Upload processing error:', error);

            // Clean up uploaded files on error
            if (req.files) {
                for (const file of req.files) {
                    try {
                        await deleteFromCloudinary(file.public_id);
                    } catch (cleanupError) {
                        console.error('Error cleaning up file:', cleanupError);
                    }
                }
            }

            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid feature ID'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Server error while processing upload'
            });
        }
    });
});

// @route   POST /api/upload/single
// @desc    Upload single file (general purpose)
// @access  Private (Admin only)
router.post('/single', authenticate, requireAdmin, (req, res) => {
    upload.single('file')(req, res, async (err) => {
        try {
            if (err) {
                console.error('Single upload error:', err);

                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 10MB.'
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message || 'Error uploading file'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const fileData = {
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                url: req.file.secure_url,
                publicId: req.file.public_id
            };

            res.json({
                success: true,
                message: 'File uploaded successfully',
                data: {
                    file: fileData
                }
            });

        } catch (error) {
            console.error('Single upload processing error:', error);

            // Clean up uploaded file on error
            if (req.file) {
                try {
                    await deleteFromCloudinary(req.file.public_id);
                } catch (cleanupError) {
                    console.error('Error cleaning up file:', cleanupError);
                }
            }

            res.status(500).json({
                success: false,
                message: 'Server error while processing upload'
            });
        }
    });
});

// @route   DELETE /api/upload/file/:publicId
// @desc    Delete file from Cloudinary
// @access  Private (Admin only)
router.delete('/file/:publicId', authenticate, requireAdmin, async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        // Delete from Cloudinary
        const result = await deleteFromCloudinary(publicId);

        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'File not found or already deleted'
            });
        }

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting file'
        });
    }
});

module.exports = router;
