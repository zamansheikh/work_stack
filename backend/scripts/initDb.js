const mongoose = require('mongoose');
require('dotenv').config();

const Feature = require('../models/Feature');
const User = require('../models/User');

// Sample features data
const sampleFeatures = [
    {
        name: 'Player Profile Management',
        description: 'Comprehensive player profile system with statistics tracking, achievements, and performance analytics.',
        purpose: 'Enable players to track their bowling performance, view statistics, and showcase achievements to build a competitive community.',
        implementation: 'Built using React components with real-time data updates. Integrated with bowling center APIs for automatic score tracking. Used Chart.js for visual analytics and performance graphs.',
        technicalDetails: 'Frontend: React, TypeScript, Chart.js. Backend: Node.js, Express, MongoDB. Real-time updates via WebSocket. Image upload with AWS S3. Authentication with JWT tokens.',
        status: 'completed',
        priority: 'high',
        tags: ['player-management', 'analytics', 'profiles'],
        author: 'Development Team'
    },
    {
        name: 'Bowling Center Integration API',
        description: 'Seamless integration with bowling center management systems for real-time lane booking and scoring.',
        purpose: 'Streamline the booking process and provide real-time scoring data to enhance the player experience and reduce manual work for bowling centers.',
        implementation: 'RESTful API with webhook support for real-time updates. OAuth 2.0 for secure authentication with bowling center systems. Queue system for handling high-volume booking requests.',
        technicalDetails: 'API Gateway with rate limiting, Redis for caching, PostgreSQL for transactional data, Docker containers for scalability. Integration with major bowling center software like Brunswick and AMF systems.',
        status: 'in-progress',
        priority: 'critical',
        tags: ['api', 'integration', 'booking', 'real-time'],
        author: 'Backend Team'
    },
    {
        name: 'Equipment Marketplace',
        description: 'Comprehensive marketplace for bowling equipment where manufacturers can list products and players can browse, compare, and purchase gear.',
        purpose: 'Create a centralized platform for bowling equipment sales, connecting manufacturers directly with players while providing detailed product information and reviews.',
        implementation: 'Multi-vendor e-commerce platform with advanced search and filtering. Integrated payment processing with Stripe. Review and rating system with moderation. Inventory management for manufacturers.',
        technicalDetails: 'Next.js for SSR/SSG, Stripe for payments, Elasticsearch for search, Redis for sessions, AWS S3 for product images. Admin dashboard for manufacturers with analytics.',
        status: 'planned',
        priority: 'medium',
        tags: ['marketplace', 'e-commerce', 'equipment', 'manufacturers'],
        author: 'Product Team'
    },
    {
        name: 'Tournament Management System',
        description: 'Complete tournament organization platform with bracket generation, scoring, live updates, and prize distribution.',
        purpose: 'Facilitate competitive bowling by providing tools for organizing tournaments, managing participants, and tracking results in real-time.',
        implementation: 'Event-driven architecture with real-time updates. Automated bracket generation algorithms. Integration with payment systems for entry fees and prize distribution. Live streaming integration for major tournaments.',
        technicalDetails: 'Microservices architecture, WebSocket for real-time updates, PostgreSQL for tournament data, Redis for leaderboards, integration with streaming platforms. Mobile-responsive design.',
        status: 'in-progress',
        priority: 'high',
        tags: ['tournaments', 'competition', 'real-time', 'payments'],
        author: 'Full Stack Team'
    },
    {
        name: 'Mobile App with Offline Support',
        description: 'Native mobile application with offline capabilities for score tracking, practice sessions, and social features.',
        purpose: 'Provide bowlers with a mobile-first experience that works even without internet connectivity, ensuring they can track their progress anywhere.',
        implementation: 'React Native for cross-platform development. Local SQLite database for offline storage. Background sync when connectivity returns. Push notifications for tournaments and social updates.',
        technicalDetails: 'React Native, SQLite, Redux for state management, Firebase for push notifications, background sync with retry logic. Biometric authentication for security.',
        status: 'planned',
        priority: 'high',
        tags: ['mobile', 'offline', 'react-native', 'sync'],
        author: 'Mobile Team'
    }
];

const initializeDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await Feature.deleteMany({});
        console.log('🗑️ Cleared existing features');

        // Insert sample features
        const features = await Feature.insertMany(sampleFeatures);
        console.log(`✅ Created ${features.length} sample features`);

        // Create admin user if it doesn't exist
        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL.toLowerCase()
        });

        if (!existingAdmin) {
            const admin = new User({
                email: process.env.ADMIN_EMAIL.toLowerCase(),
                password: process.env.ADMIN_PASSWORD,
                role: 'admin',
                name: 'Super Admin'
            });
            await admin.save();
            console.log('✅ Created admin user');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        console.log('\n🎉 Database initialization completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • Features: ${features.length}`);
        console.log(`   • Admin Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`   • Admin Password: ${process.env.ADMIN_PASSWORD}`);
        console.log('\n🚀 You can now start the server with: npm run dev');

    } catch (error) {
        console.error('❌ Database initialization error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📦 Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run initialization
initializeDatabase();
