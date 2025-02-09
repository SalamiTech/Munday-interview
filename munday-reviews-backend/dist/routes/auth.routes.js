"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Login
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Please provide a password')
], async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password || '');
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.fullName } });
    }
    catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});
// Register
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required')
], async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Check if user exists
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Create user
        const user = await models_1.User.create({
            email,
            password,
            firstName,
            lastName,
            role: 'user',
            isActive: true
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.fullName } });
    }
    catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
});
// Protected routes
router.use(auth_1.auth);
// Get current user
router.get('/me', async (req, res) => {
    var _a;
    try {
        const user = await models_1.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});
exports.default = router;
