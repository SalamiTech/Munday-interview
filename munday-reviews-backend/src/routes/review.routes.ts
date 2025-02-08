import { Router } from 'express';
import {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    moderateReview,
    voteReviewHelpful,
    reportReview
} from '../controllers/review.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.get('/', getAllReviews);
router.get('/:id', getReview);

// Protected routes
router.use(protect);

// Create review
router.post('/', [
    body('organizationId')
        .notEmpty().withMessage('Organization ID is required'),
    body('content')
        .notEmpty().withMessage('Review content is required')
        .isLength({ min: 10 }).withMessage('Review must be at least 10 characters long')
        .trim(),
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title')
        .optional()
        .trim(),
    validateRequest
], createReview);

// Update own review
router.patch('/:id', [
    body('content')
        .optional()
        .notEmpty().withMessage('Review content cannot be empty')
        .isLength({ min: 10 }).withMessage('Review must be at least 10 characters long')
        .trim(),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validateRequest
], updateReview);

// Delete own review
router.delete('/:id', deleteReview);

// Vote review as helpful
router.post('/:id/helpful', voteReviewHelpful);

// Report review
router.post('/:id/report', reportReview);

// Admin only routes
router.use(restrictTo('admin'));

// Moderate review
router.patch('/:id/moderate', [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
    body('moderationNotes')
        .optional()
        .trim(),
    validateRequest
], moderateReview);

export default router; 