"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("../controllers/organization.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', organization_controller_1.getAllOrganizations);
router.get('/:id', organization_controller_1.getOrganization);
// Protected routes
router.use(auth_middleware_1.protect);
// Admin only routes
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.get('/stats/industry', organization_controller_1.getOrganizationStats);
router.post('/', [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('Organization name is required')
        .trim(),
    (0, express_validator_1.body)('description')
        .notEmpty().withMessage('Description is required')
        .trim(),
    (0, express_validator_1.body)('industry')
        .notEmpty().withMessage('Industry is required')
        .trim(),
    (0, express_validator_1.body)('location')
        .notEmpty().withMessage('Location is required')
        .trim(),
    (0, express_validator_1.body)('employeeCount')
        .notEmpty().withMessage('Employee count is required')
        .isInt({ min: 1 }).withMessage('Employee count must be at least 1'),
    (0, express_validator_1.body)('website')
        .optional()
        .isURL().withMessage('Please provide a valid URL'),
    (0, express_validator_1.body)('logo')
        .optional()
        .isURL().withMessage('Please provide a valid URL for logo'),
    validate_middleware_1.validateRequest
], organization_controller_1.createOrganization);
router.patch('/:id', [
    (0, express_validator_1.body)('name')
        .optional()
        .notEmpty().withMessage('Organization name cannot be empty')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .notEmpty().withMessage('Description cannot be empty')
        .trim(),
    (0, express_validator_1.body)('industry')
        .optional()
        .notEmpty().withMessage('Industry cannot be empty')
        .trim(),
    (0, express_validator_1.body)('location')
        .optional()
        .notEmpty().withMessage('Location cannot be empty')
        .trim(),
    (0, express_validator_1.body)('employeeCount')
        .optional()
        .isInt({ min: 1 }).withMessage('Employee count must be at least 1'),
    (0, express_validator_1.body)('website')
        .optional()
        .isURL().withMessage('Please provide a valid URL'),
    (0, express_validator_1.body)('logo')
        .optional()
        .isURL().withMessage('Please provide a valid URL for logo'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
    validate_middleware_1.validateRequest
], organization_controller_1.updateOrganization);
router.delete('/:id', organization_controller_1.deleteOrganization);
exports.default = router;
