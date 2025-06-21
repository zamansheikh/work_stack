const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            console.log('Super Admin already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('superadmin123', salt);

        // Create super admin user
        const superAdmin = new User({
            name: 'Super Administrator',
            email: 'superadmin',
            password: hashedPassword,
            role: 'superadmin',
            enabled: true
        });

        await superAdmin.save();
        console.log('Super Admin created successfully');

        // Also create a regular admin user for testing
        const adminHashedPassword = await bcrypt.hash('admin123', salt);
        const admin = new User({
            name: 'jayfettig',
            email: 'jayfettig',
            password: adminHashedPassword,
            role: 'admin',
            enabled: true
        });

        // await admin.save();
        console.log('Regular Admin created successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedSuperAdmin();