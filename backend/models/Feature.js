const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        default: ''
    },
    implementation: {
        type: String,
        default: ''
    },
    technicalDetails: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed', 'on-hold', 'cancelled'],
        default: 'planned'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: String,
        default: 'Development Team'
    },
    attachments: [{
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for better search performance
featureSchema.index({ name: 'text', description: 'text', tags: 'text' });
featureSchema.index({ status: 1 });
featureSchema.index({ priority: 1 });
featureSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feature', featureSchema);
