import { Request, Response, NextFunction } from 'express';
import { validationResult, body, query, param, Meta, CustomValidator } from 'express-validator';

interface TypedRequestQuery extends Request {
    query: {
        startDate?: string;
        endDate?: string;
        minRating?: string;
        maxRating?: string;
        keyword?: string;
        status?: 'pending' | 'approved' | 'rejected';
        page?: string;
        limit?: string;
    };
}

interface ReviewFilters {
    startDate?: string;
    endDate?: string;
    minRating?: string;
    maxRating?: string;
    keyword?: string;
    status?: 'pending' | 'approved' | 'rejected';
    page?: string;
    limit?: string;
}

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ message: errorMessages.join('. ') });
    }
    next();
};

export const validateReview = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Title must be between 5 and 100 characters'),
    body('content')
        .trim()
        .isLength({ min: 50, max: 2000 })
        .withMessage('Review content must be between 50 and 2000 characters'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('pros')
        .isArray()
        .withMessage('Pros must be an array')
        .custom((value: string[]) => {
            if (!value.every(item => typeof item === 'string' && item.length >= 3)) {
                throw new Error('Each pro must be at least 3 characters long');
            }
            if (value.length > 5) {
                throw new Error('Maximum 5 pros allowed');
            }
            return true;
        }),
    body('cons')
        .isArray()
        .withMessage('Cons must be an array')
        .custom((value: string[]) => {
            if (!value.every(item => typeof item === 'string' && item.length >= 3)) {
                throw new Error('Each con must be at least 3 characters long');
            }
            if (value.length > 5) {
                throw new Error('Maximum 5 cons allowed');
            }
            return true;
        }),
    body('organizationId')
        .isInt({ min: 1 })
        .withMessage('Valid organization ID is required'),
    validateRequest
];

export const validateReviewFilters = [
    query('startDate')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),
    query('endDate')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage('End date must be a valid ISO date')
        .custom((endDate: string, { req }) => {
            const query = req.query as ReviewFilters;
            if (endDate && query.startDate && endDate < query.startDate) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    query('minRating')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Minimum rating must be between 1 and 5'),
    query('maxRating')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Maximum rating must be between 1 and 5')
        .custom((maxRating: string, { req }) => {
            const query = req.query as ReviewFilters;
            if (maxRating && query.minRating && Number(maxRating) < Number(query.minRating)) {
                throw new Error('Maximum rating must be greater than minimum rating');
            }
            return true;
        }),
    query('keyword')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Search keyword must be at least 2 characters long'),
    query('status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['pending', 'approved', 'rejected'])
        .withMessage('Invalid review status'),
    query('page')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validateRequest
];

export const validateOrganization = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Organization name must be between 2 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 50, max: 2000 })
        .withMessage('Description must be between 50 and 2000 characters'),
    body('industry')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Industry must be between 2 and 50 characters'),
    body('location')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Website must be a valid URL'),
    validateRequest
];

export const validateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    validateRequest
]; 