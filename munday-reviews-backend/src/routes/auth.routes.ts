import { Router, Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a password')
], async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password || '');
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// Register
router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
], async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: 'user',
            isActive: true
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Protected routes
router.use(auth);

// Get current user
router.get('/me', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

export default router;