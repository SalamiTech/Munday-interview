import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeModels } from './models';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        await initializeModels();
        await sequelize.sync();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 