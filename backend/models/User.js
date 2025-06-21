const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ enabled: 1 });

module.exports = mongoose.model('User', userSchema);
