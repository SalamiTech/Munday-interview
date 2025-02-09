import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import routes from './routes';
import { initializeModels } from './models';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { setupWebSocket } from './config/websocket';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        // Initialize database
        await initializeModels();
        await sequelize.sync({ force: true }); // This will recreate tables

        // Initialize WebSocket
        const io = setupWebSocket(httpServer);

        const PORT = process.env.PORT || 3000;
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`WebSocket server is ready`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 