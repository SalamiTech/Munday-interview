import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Organization } from './organization.model';
import { Review } from './review.model';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false // Set to console.log for debugging
});

// Initialize models
export async function initializeModels() {
    try {
        // Initialize models
        User.initialize(sequelize);
        Organization.initialize(sequelize);
        Review.initialize(sequelize);

        // Set up associations
        User.hasMany(Review);
        Review.belongsTo(User);

        Organization.hasMany(Review);
        Review.belongsTo(Organization);

        // Sync database - this will create tables
        await sequelize.sync({ force: true });
        console.log('Database synchronized');

        // Seed initial data
        await seedInitialData();
        console.log('Initial data seeded successfully');

        console.log('Models initialized successfully');
    } catch (error) {
        console.error('Error initializing models:', error);
        throw error;
    }
}

async function seedInitialData() {
    try {
        // Create sample organizations
        const organizations = [
            {
                name: 'Tech Innovators Inc',
                description: 'Leading technology company focused on innovation and digital transformation.',
                industry: 'Technology',
                location: 'San Francisco, CA',
                employeeCount: 500,
                website: 'https://techinnovators.com',
                status: 'active' as const,
                averageRating: 4.5,
                reviewCount: 25,
                interviewSuccessRate: 0.85,
                averageSalary: 120000
            },
            {
                name: 'Global Finance Group',
                description: 'International financial services provider with expertise in investment banking.',
                industry: 'Finance',
                location: 'New York, NY',
                employeeCount: 1000,
                website: 'https://globalfinance.com',
                status: 'active' as const,
                averageRating: 4.2,
                reviewCount: 15,
                interviewSuccessRate: 0.75,
                averageSalary: 150000
            },
            {
                name: 'Healthcare Solutions',
                description: 'Leading healthcare technology and services provider.',
                industry: 'Healthcare',
                location: 'Boston, MA',
                employeeCount: 750,
                website: 'https://healthcaresolutions.com',
                status: 'active' as const,
                averageRating: 4.0,
                reviewCount: 20,
                interviewSuccessRate: 0.80,
                averageSalary: 110000
            }
        ];

        for (const org of organizations) {
            await Organization.create(org);
        }

        // Create a default admin user
        await User.create({
            email: 'admin@example.com',
            password: '$2a$10$rQnpkWDXCw.ggQwxQX6Qz.YlqYQCqX6r5MqX5Q8Q8Q8Q8Q8Q8Q',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true
        });

    } catch (error) {
        console.error('Error seeding initial data:', error);
        throw error;
    }
}

export { sequelize, User, Organization, Review }; 