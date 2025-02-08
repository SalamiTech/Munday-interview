import { Review, Organization, User } from '../models';
import { BaseService } from './base.service';
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
}

export class ReviewService extends BaseService<Review> {
    constructor() {
        super(Review);
    }

    async findAllWithDetails(options: {
        search?: string;
        organizationId?: number;
        userId?: number;
        rating?: number;
        status?: string;
        page?: number;
        limit?: number;
        order?: string;
    }) {
        const { search, organizationId, userId, rating, status, page = 1, limit = 10, order = 'createdAt:desc' } = options;

        const where: any = {};
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ];
        }
        if (organizationId) where.organizationId = organizationId;
        if (userId) where.userId = userId;
        if (rating) where.rating = rating;
        if (status) where.status = status;

        const [orderField, orderDirection] = order.split(':');

        return this.findAll({
            where,
            page,
            limit,
            order: [[orderField, orderDirection.toUpperCase()]],
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar']
                },
                {
                    model: Organization,
                    attributes: ['id', 'name', 'industry', 'logo']
                }
            ]
        });
    }

    async createReview(data: {
        title: string;
        content: string;
        rating: number;
        pros?: string;
        cons?: string;
        isAnonymous: boolean;
        userId: number;
        organizationId: number;
    }) {
        // Check if user already reviewed this organization
        const existingReview = await this.model.findOne({
            where: {
                userId: data.userId,
                organizationId: data.organizationId
            }
        });

        if (existingReview) {
            throw new AppError('You have already reviewed this organization', 400);
        }

        return this.create(data);
    }

    async moderateReview(id: number, data: {
        status: 'approved' | 'rejected';
        moderatorId: number;
        moderationNotes?: string;
    }) {
        const review = await this.findById(id);
        
        await review.update({
            ...data,
            moderatedAt: new Date()
        });

        return review;
    }

    async toggleHelpful(reviewId: number, userId: number) {
        const review = await this.findById(reviewId);
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();
        return review;
    }

    async reportReview(reviewId: number, userId: number, reason: string) {
        const review = await this.findById(reviewId);
        review.reportCount = (review.reportCount || 0) + 1;
        
        // If report count reaches threshold, flag the review
        if (review.reportCount >= 3) {
            review.status = 'rejected';
        }
        
        await review.save();
        return review;
    }

    async getReviewStats(organizationId?: number): Promise<ReviewStats> {
        const where = organizationId ? { organizationId } : {};
        
        const reviews = await this.model.findAll({
            where,
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews'],
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
            ],
            raw: true
        });

        const ratingDistribution = await this.model.findAll({
            where,
            attributes: [
                'rating',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['rating'],
            raw: true
        });

        const distribution = ratingDistribution.reduce((acc: { [key: number]: number }, curr: any) => {
            acc[curr.rating] = parseInt(curr.count);
            return acc;
        }, {});

        return {
            totalReviews: parseInt(reviews[0].totalReviews),
            averageRating: parseFloat(reviews[0].averageRating) || 0,
            ratingDistribution: distribution
        };
    }
} 