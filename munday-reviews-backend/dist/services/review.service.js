"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const models_1 = require("../models");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ReviewService extends base_service_1.BaseService {
    constructor() {
        super(models_1.Review);
    }
    async findAllWithDetails(options) {
        const { search, organizationId, userId, rating, status, page = 1, limit = 10, order = 'createdAt:desc' } = options;
        const where = {};
        if (search) {
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${search}%` } },
                { content: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        if (organizationId)
            where.organizationId = organizationId;
        if (userId)
            where.userId = userId;
        if (rating)
            where.rating = rating;
        if (status)
            where.status = status;
        const [orderField, orderDirection] = order.split(':');
        return this.findAll({
            where,
            page,
            limit,
            order: [[orderField, orderDirection.toUpperCase()]],
            include: [
                {
                    model: models_1.User,
                    attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar']
                },
                {
                    model: models_1.Organization,
                    attributes: ['id', 'name', 'industry', 'logo']
                }
            ]
        });
    }
    async createReview(data) {
        // Check if user has already reviewed this organization
        const existingReview = await this.model.findOne({
            where: {
                userId: data.userId,
                organizationId: data.organizationId
            }
        });
        if (existingReview) {
            throw new AppError_1.AppError('You have already reviewed this organization', 400);
        }
        return this.create(data);
    }
    async moderateReview(id, data) {
        const review = await this.findById(id);
        await review.update({
            ...data,
            moderatedAt: new Date()
        });
        return review;
    }
    async toggleHelpful(reviewId, userId) {
        const review = await this.findById(reviewId);
        // Check if user has already marked this review as helpful
        // This would typically be handled by a separate join table
        // For simplicity, we're just incrementing the count here
        await review.increment('helpfulCount');
        return review;
    }
    async reportReview(reviewId, userId, reason) {
        const review = await this.findById(reviewId);
        // Increment report count
        await review.increment('reportCount');
        // If report count exceeds threshold, automatically mark for moderation
        if (review.reportCount >= 5) {
            await review.update({ status: 'pending' });
        }
        return review;
    }
    async getReviewStats(organizationId) {
        const where = organizationId ? { organizationId } : {};
        const stats = await this.model.findAll({
            where,
            attributes: [
                'rating',
                [database_1.default.fn('COUNT', database_1.default.col('id')), 'count']
            ],
            group: ['rating'],
            order: [['rating', 'ASC']]
        });
        return stats;
    }
}
exports.ReviewService = ReviewService;
