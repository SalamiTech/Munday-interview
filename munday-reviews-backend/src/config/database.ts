import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const dbPath = path.join(__dirname, '..', '..', 'data', 'database.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false, // Set to console.log for debugging
    define: {
        timestamps: true,
        paranoid: true, // This enables soft deletes
        underscored: true,
    }
});

// Initialize database
export async function initDatabase(models: any[]) {
    try {
        // Initialize each model
        models.forEach(model => {
            if (typeof model.initialize === 'function') {
                model.initialize(sequelize);
            }
        });

        // Set up associations
        models.forEach(model => {
            if (typeof model.associate === 'function') {
                model.associate(models.reduce((acc, m) => {
                    acc[m.name] = m;
                    return acc;
                }, {}));
            }
        });

        // Sync models without force
        await sequelize.sync();
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

export default sequelize; 