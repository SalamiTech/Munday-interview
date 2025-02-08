"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', review_controller_1.getAllReviews);
router.get('/:id', review_controller_1.getReview);
// Protected routes
router.use(auth_middleware_1.protect);
// Create review
router.post('/', [
    (0, express_validator_1.body)('organizationId')
        .notEmpty().withMessage('Organization ID is required'),
    (0, express_validator_1.body)('content')
        .notEmpty().withMessage('Review content is required')
        .isLength({ min: 10 }).withMessage('Review must be at least 10 characters long')
        .trim(),
    (0, express_validator_1.body)('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim(),
    validate_middleware_1.validateRequest
], review_controller_1.createReview);
// Update own review
router.patch('/:id', [
    (0, express_validator_1.body)('content')
        .optional()
        .notEmpty().withMessage('Review content cannot be empty')
        .isLength({ min: 10 }).withMessage('Review must be at least 10 characters long')
        .trim(),
    (0, express_validator_1.body)('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate_middleware_1.validateRequest
], review_controller_1.updateReview);
// Delete own review
router.delete('/:id', review_controller_1.deleteReview);
// Vote review as helpful
router.post('/:id/helpful', review_controller_1.voteReviewHelpful);
// Report review
router.post('/:id/report', review_controller_1.reportReview);
// Admin only routes
router.use((0, auth_middleware_1.restrictTo)('admin'));
// Moderate review
router.patch('/:id/moderate', [
    (0, express_validator_1.body)('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
    (0, express_validator_1.body)('moderationNotes')
        .optional()
        .trim(),
    validate_middleware_1.validateRequest
], review_controller_1.moderateReview);
exports.default = router;
