"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const dbPath = path_1.default.join(__dirname, '..', '..', 'data', 'database.sqlite');
// Delete existing database file if it exists
if (fs_1.default.existsSync(dbPath)) {
    fs_1.default.unlinkSync(dbPath);
    console.log('Existing database deleted');
}
const sequelize = new sequelize_typescript_1.Sequelize({
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
async function initDatabase(models) {
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
    }
    catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}
exports.default = sequelize;
