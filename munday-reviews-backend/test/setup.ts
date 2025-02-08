import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User, Organization, Review } from '../src/models';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create test database connection
export const testDb = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    models: [User, Organization, Review]
});

// Global setup
beforeAll(async () => {
    await testDb.authenticate();
    await testDb.sync({ force: true });
});

// Global teardown
afterAll(async () => {
    await testDb.close();
});

// Clear database between tests
afterEach(async () => {
    await Promise.all([
        User.destroy({ where: {}, force: true }),
        Organization.destroy({ where: {}, force: true }),
        Review.destroy({ where: {}, force: true })
    ]);
}); 