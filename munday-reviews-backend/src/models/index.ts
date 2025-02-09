import { User } from './user.model';
import { Review } from './review.model';
import { Organization } from './organization.model';
import sequelize from '../config/database';

const models = {
    User,
    Review,
    Organization
};

export async function initializeModels() {
    try {
        // Initialize each model with sequelize instance
        Object.values(models).forEach(model => {
            if (typeof model.initialize === 'function') {
                model.initialize(sequelize);
            }
        });

        // Set up associations
        Object.values(models).forEach(model => {
            if (typeof model.associate === 'function') {
                model.associate(models);
            }
        });

        console.log('Models initialized successfully');
    } catch (error) {
        console.error('Error initializing models:', error);
        throw error;
    }
}

export { User, Review, Organization };
export default models; 