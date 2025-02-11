import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Organization } from './organization.model';
import { Review } from './review.model';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(__dirname, '..', '..', 'data', 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
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
        User.hasMany(Review, { as: 'reviews' });
        Review.belongsTo(User, { as: 'user' });

        Organization.hasMany(Review, { as: 'reviews' });
        Review.belongsTo(Organization, { as: 'organization' });

        // Sync database without force
        await sequelize.sync();
        console.log('Database synchronized');

        // Only seed data if no organizations exist
        const count = await Organization.count();
        if (count === 0) {
            await seedInitialData();
            console.log('Initial data seeded successfully');
        }

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

        // Create a default admin user with properly hashed password
        const hashedPassword = await bcrypt.hash('Admin123!@#', 10);
        await User.create({
            email: 'admin@example.com',
            password: hashedPassword,
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