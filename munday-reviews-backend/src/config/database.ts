import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const dbPath = path.join(__dirname, '..', '..', 'data', 'database.sqlite');

// Delete existing database file if it exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Existing database deleted');
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        paranoid: true
    },
    dialectOptions: {
        foreign_keys: true
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

        // Set up associations after all models are initialized
        models.forEach(model => {
            if (typeof model.associate === 'function') {
                model.associate(models.reduce((acc, m) => {
                    acc[m.name] = m;
                    return acc;
                }, {}));
            }
        });

        // Disable foreign key checks
        await sequelize.query('PRAGMA foreign_keys = OFF;');
        
        // Sync all models
        await sequelize.sync({ force: true });
        
        // Re-enable foreign key checks
        await sequelize.query('PRAGMA foreign_keys = ON;');
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

export default sequelize; 