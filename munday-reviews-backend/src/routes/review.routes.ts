import { Router, Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Review, User, Organization } from '../models';
import { auth } from '../middleware/auth';
import { validateReview, validateReviewFilters } from '../middleware/validate.middleware';

// Extend Express Request type
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: number;
            role: 'user' | 'admin';
        };
    }
}

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface ReviewWhereAttributes {
    id?: number;
    title?: string;
    content?: string;
    rating?: number | { [Op.gte]?: number; [Op.lte]?: number };
    status?: ReviewStatus;
    createdAt?: Date | { [Op.gte]?: Date; [Op.lte]?: Date };
    deletedAt?: null;
    [Op.or]?: Array<{ [key: string]: any }>;
}

const router = Router();

// Get all reviews with filtering
router.get('/', validateReviewFilters, async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            minRating,
            maxRating,
            keyword,
            status,
            page = '1',
            limit = '10'
        } = req.query;

        const where: ReviewWhereAttributes = {
            deletedAt: null
        };

        // Date range filter
        if (startDate || endDate) {
            const createdAtFilter: { [Op.gte]?: Date; [Op.lte]?: Date } = {};
            if (startDate) createdAtFilter[Op.gte] = new Date(startDate as string);
            if (endDate) createdAtFilter[Op.lte] = new Date(endDate as string);
            where.createdAt = createdAtFilter;
        }

        // Rating range filter
        if (minRating || maxRating) {
            const ratingFilter: { [Op.gte]?: number; [Op.lte]?: number } = {};
            if (minRating) ratingFilter[Op.gte] = parseInt(minRating as string);
            if (maxRating) ratingFilter[Op.lte] = parseInt(maxRating as string);
            where.rating = ratingFilter;
        }

        // Keyword search in title and content
        if (keyword) {
            where[Op.or] = [
                { title: { [Op.like]: `%${keyword}%` } },
                { content: { [Op.like]: `%${keyword}%` } }
            ];
        }

        // Status filter
        if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
            where.status = status as ReviewStatus;
        }

        const pageNum = parseInt(page as string);
        const limitNum = Math.min(parseInt(limit as string), 100);

        const { count, rows } = await Review.findAndCountAll({
            where: where as WhereOptions<any>,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'avatar']
                },
                {
                    model: Organization,
                    as: 'organization',
                    attributes: ['id', 'name', 'industry', 'logo']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: (pageNum - 1) * limitNum
        });

        res.json({
            items: rows,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            hasMore: pageNum * limitNum < count
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// Get review statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.query;
        
        const where: WhereOptions<any> = {};
        if (organizationId) {
            where.organizationId = Number(organizationId);
        }
        
        const stats = await Review.findOne({
            where,
            attributes: [
                [Review.sequelize!.fn('COUNT', Review.sequelize!.col('id')), 'totalReviews'],
                [Review.sequelize!.fn('AVG', Review.sequelize!.col('rating')), 'averageRating'],
                [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 1 THEN 1 END')), 'rating1'],
                [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 2 THEN 1 END')), 'rating2'],
                [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 3 THEN 1 END')), 'rating3'],
                [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 4 THEN 1 END')), 'rating4'],
                [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 5 THEN 1 END')), 'rating5']
            ],
            raw: true
        });

        const result = stats as any;
        res.json({
            totalReviews: Number(result?.totalReviews || 0),
            averageRating: Number(result?.averageRating || 0),
            ratingDistribution: {
                1: Number(result?.rating1 || 0),
                2: Number(result?.rating2 || 0),
                3: Number(result?.rating3 || 0),
                4: Number(result?.rating4 || 0),
                5: Number(result?.rating5 || 0)
            }
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Failed to fetch review statistics' });
    }
});

// Get single review
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const review = await Review.findByPk(req.params.id, {
            include: ['user', 'organization']
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ message: 'Failed to fetch review' });
    }
});

// Create review
router.post('/', auth, validateReview, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.create({
            ...req.body,
            userId: req.user.id,
            status: 'pending'
        });

        const createdReview = await Review.findByPk(review.id, {
            include: ['user', 'organization']
        });

        res.status(201).json(createdReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Failed to create review' });
    }
});

// Update review
router.patch('/:id', auth, validateReview, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.update(req.body);
        
        const updatedReview = await Review.findByPk(review.id, {
            include: ['user', 'organization']
        });

        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Failed to update review' });
    }
});

// Delete review
router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

export default router; 