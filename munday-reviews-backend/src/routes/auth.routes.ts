import { Router } from 'express';
import { register, login, getMe, updatePassword, updateMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    validateRequest
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a password'),
    validateRequest
], login);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.patch('/updatePassword', [
    body('currentPassword').notEmpty().withMessage('Please provide your current password'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    validateRequest
], updatePassword);

router.patch('/updateMe', [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('avatar').optional().isURL().withMessage('Please provide a valid URL for avatar'),
    validateRequest
], updateMe);

export default router; 