const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Feature name is required'],
        trim: true,
        maxlength: [200, 'Feature name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Feature description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    purpose: {
        type: String,
        required: [true, 'Feature purpose is required'],
        trim: true,
        maxlength: [2000, 'Purpose cannot exceed 2000 characters']
    },
    implementation: {
        type: String,
        required: [true, 'Implementation details are required'],
        trim: true,
        maxlength: [3000, 'Implementation details cannot exceed 3000 characters']
    },
    technicalDetails: {
        type: String,
        required: [true, 'Technical details are required'],
        trim: true,
        maxlength: [3000, 'Technical details cannot exceed 3000 characters']
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed', 'on-hold'],
        default: 'planned',
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    attachments: [attachmentSchema],
    author: {
        type: String,
        required: true,
        default: 'Development Team'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field before saving
featureSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for better query performance
featureSchema.index({ name: 'text', description: 'text', tags: 'text' });
featureSchema.index({ status: 1 });
featureSchema.index({ priority: 1 });
featureSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feature', featureSchema);
