import { Router } from 'express';
import {
    getAllOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationStats
} from '../controllers/organization.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.get('/', getAllOrganizations);
router.get('/:id', getOrganization);

// Protected routes
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));

router.get('/stats/industry', getOrganizationStats);

router.post('/', [
    body('name')
        .notEmpty().withMessage('Organization name is required')
        .trim(),
    body('description')
        .notEmpty().withMessage('Description is required')
        .trim(),
    body('industry')
        .notEmpty().withMessage('Industry is required')
        .trim(),
    body('location')
        .notEmpty().withMessage('Location is required')
        .trim(),
    body('employeeCount')
        .notEmpty().withMessage('Employee count is required')
        .isInt({ min: 1 }).withMessage('Employee count must be at least 1'),
    body('website')
        .optional()
        .isURL().withMessage('Please provide a valid URL'),
    body('logo')
        .optional()
        .isURL().withMessage('Please provide a valid URL for logo'),
    validateRequest
], createOrganization);

router.patch('/:id', [
    body('name')
        .optional()
        .notEmpty().withMessage('Organization name cannot be empty')
        .trim(),
    body('description')
        .optional()
        .notEmpty().withMessage('Description cannot be empty')
        .trim(),
    body('industry')
        .optional()
        .notEmpty().withMessage('Industry cannot be empty')
        .trim(),
    body('location')
        .optional()
        .notEmpty().withMessage('Location cannot be empty')
        .trim(),
    body('employeeCount')
        .optional()
        .isInt({ min: 1 }).withMessage('Employee count must be at least 1'),
    body('website')
        .optional()
        .isURL().withMessage('Please provide a valid URL'),
    body('logo')
        .optional()
        .isURL().withMessage('Please provide a valid URL for logo'),
    body('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
    validateRequest
], updateOrganization);

router.delete('/:id', deleteOrganization);

export default router; 