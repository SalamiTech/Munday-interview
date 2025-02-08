import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import sequelize from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import organizationRoutes from './routes/organization.routes';
import reviewRoutes from './routes/review.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Request parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Database connection and model synchronization
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
        return sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/reviews', reviewRoutes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
}); 