import { Feature } from '@/types';

export const mockFeatures: Feature[] = [
    {
        id: '1',
        name: 'Player Profile Management',
        description: 'Comprehensive player profile system with statistics tracking, achievements, and performance analytics.',
        purpose: 'Enable players to track their bowling performance, view statistics, and showcase achievements to build a competitive community.',
        implementation: 'Built using React components with real-time data updates. Integrated with bowling center APIs for automatic score tracking. Used Chart.js for visual analytics and performance graphs.',
        technicalDetails: 'Frontend: React, TypeScript, Chart.js. Backend: Node.js, Express, MongoDB. Real-time updates via WebSocket. Image upload with AWS S3. Authentication with JWT tokens.',
        status: 'completed' as const,
        priority: 'high' as const,
        attachments: [
            {
                id: 'att1',
                fileName: 'player-profile-wireframe.pdf',
                fileType: 'application/pdf',
                fileSize: 2048000,
                url: '/attachments/player-profile-wireframe.pdf',
                uploadedAt: new Date('2024-12-01')
            },
            {
                id: 'att2',
                fileName: 'profile-screenshot.png',
                fileType: 'image/png',
                fileSize: 1024000,
                url: '/attachments/profile-screenshot.png',
                uploadedAt: new Date('2024-12-15')
            }
        ],
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-12-20'),
        author: 'Development Team',
        tags: ['player-management', 'analytics', 'profiles']
    },
    {
        id: '2',
        name: 'Bowling Center Integration API',
        description: 'Seamless integration with bowling center management systems for real-time lane booking and scoring.',
        purpose: 'Streamline the booking process and provide real-time scoring data to enhance the player experience and reduce manual work for bowling centers.',
        implementation: 'RESTful API with webhook support for real-time updates. OAuth 2.0 for secure authentication with bowling center systems. Queue system for handling high-volume booking requests.',
        technicalDetails: 'API Gateway with rate limiting, Redis for caching, PostgreSQL for transactional data, Docker containers for scalability. Integration with major bowling center software like Brunswick and AMF systems.',
        status: 'in-progress' as const,
        priority: 'critical' as const,
        attachments: [
            {
                id: 'att3',
                fileName: 'api-documentation.pdf',
                fileType: 'application/pdf',
                fileSize: 3072000,
                url: '/attachments/api-documentation.pdf',
                uploadedAt: new Date('2025-01-10')
            }
        ],
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2025-01-15'),
        author: 'Backend Team',
        tags: ['api', 'integration', 'booking', 'real-time']
    },
    {
        id: '3',
        name: 'Equipment Marketplace',
        description: 'Comprehensive marketplace for bowling equipment where manufacturers can list products and players can browse, compare, and purchase gear.',
        purpose: 'Create a centralized platform for bowling equipment sales, connecting manufacturers directly with players while providing detailed product information and reviews.',
        implementation: 'Multi-vendor e-commerce platform with advanced search and filtering. Integrated payment processing with Stripe. Review and rating system with moderation. Inventory management for manufacturers.',
        technicalDetails: 'Next.js for SSR/SSG, Stripe for payments, Elasticsearch for search, Redis for sessions, AWS S3 for product images. Admin dashboard for manufacturers with analytics.',
        status: 'planned' as const,
        priority: 'medium' as const,
        attachments: [],
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-05'),
        author: 'Product Team',
        tags: ['marketplace', 'e-commerce', 'equipment', 'manufacturers']
    },
    {
        id: '4',
        name: 'Tournament Management System',
        description: 'Complete tournament organization platform with bracket generation, scoring, live updates, and prize distribution.',
        purpose: 'Facilitate competitive bowling by providing tools for organizing tournaments, managing participants, and tracking results in real-time.',
        implementation: 'Event-driven architecture with real-time updates. Automated bracket generation algorithms. Integration with payment systems for entry fees and prize distribution. Live streaming integration for major tournaments.',
        technicalDetails: 'Microservices architecture, WebSocket for real-time updates, PostgreSQL for tournament data, Redis for leaderboards, integration with streaming platforms. Mobile-responsive design.',
        status: 'in-progress' as const,
        priority: 'high' as const,
        attachments: [
            {
                id: 'att4',
                fileName: 'tournament-flow-diagram.png',
                fileType: 'image/png',
                fileSize: 1536000,
                url: '/attachments/tournament-flow-diagram.png',
                uploadedAt: new Date('2025-01-12')
            }
        ],
        createdAt: new Date('2024-12-20'),
        updatedAt: new Date('2025-01-20'),
        author: 'Full Stack Team',
        tags: ['tournaments', 'competition', 'real-time', 'payments']
    },
    {
        id: '5',
        name: 'Mobile App with Offline Support',
        description: 'Native mobile application with offline capabilities for score tracking, practice sessions, and social features.',
        purpose: 'Provide bowlers with a mobile-first experience that works even without internet connectivity, ensuring they can track their progress anywhere.',
        implementation: 'React Native for cross-platform development. Local SQLite database for offline storage. Background sync when connectivity returns. Push notifications for tournaments and social updates.',
        technicalDetails: 'React Native, SQLite, Redux for state management, Firebase for push notifications, background sync with retry logic. Biometric authentication for security.',
        status: 'planned' as const,
        priority: 'high' as const,
        attachments: [],
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10'),
        author: 'Mobile Team',
        tags: ['mobile', 'offline', 'react-native', 'sync']
    }
];

export const getFeatureById = (id: string): Feature | undefined => {
    return mockFeatures.find(feature => feature.id === id);
};

export const getFeaturesByStatus = (status: Feature['status']): Feature[] => {
    return mockFeatures.filter(feature => feature.status === status);
};

export const getFeaturesByTag = (tag: string): Feature[] => {
    return mockFeatures.filter(feature => feature.tags.includes(tag));
};
