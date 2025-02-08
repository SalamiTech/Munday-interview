"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const errorHandler_1 = require("./middleware/errorHandler");
const AppError_1 = require("./utils/AppError");
const database_1 = __importDefault(require("./config/database"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const organization_routes_1 = __importDefault(require("./routes/organization.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
// Request parsing middleware
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Database connection and model synchronization
database_1.default.authenticate()
    .then(() => {
    console.log('Connected to MySQL database');
    return database_1.default.sync({ alter: process.env.NODE_ENV === 'development' });
})
    .then(() => {
    console.log('Database synchronized');
})
    .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/organizations', organization_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handling middleware
app.use(errorHandler_1.globalErrorHandler);
// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
