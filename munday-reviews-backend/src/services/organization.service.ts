import { Organization, Review, User } from '../models';
import { BaseService } from './base.service';
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export class OrganizationService extends BaseService<Organization> {
    constructor() {
        super(Organization);
    }

    async findAllWithStats(options: {
        search?: string;
        industry?: string;
        size?: string;
        page?: number;
        limit?: number;
        order?: string;
    }) {
        const { search, industry, size, page = 1, limit = 10, order = 'name:asc' } = options;

        const where: any = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        if (industry) where.industry = industry;
        if (size) where.size = size;

        const [orderField, orderDirection] = order.split(':');
        
        return this.findAll({
            where,
            page,
            limit,
            order: [[orderField, orderDirection.toUpperCase()]],
            include: [{
                model: Review,
                attributes: []
            }]
        });
    }

    async getOrganizationStats() {
        const stats = await this.model.findAll({
            attributes: [
                'industry',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'totalReviews']
            ],
            include: [{
                model: Review,
                attributes: []
            }],
            group: ['industry']
        });

        return stats;
    }

    async verifyOrganization(id: number, adminId: number) {
        const organization = await this.findById(id);
        if (organization.isVerified) {
            throw new AppError('Organization is already verified', 400);
        }

        await organization.update({
            isVerified: true,
            verifiedBy: adminId,
            verifiedAt: new Date()
        });

        return organization;
    }

    async getTopOrganizations(limit: number = 5) {
        return this.model.findAll({
            include: [{
                model: Review,
                attributes: []
            }],
            attributes: [
                'id',
                'name',
                'industry',
                [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'totalReviews']
            ],
            group: ['Organization.id'],
            having: sequelize.literal('COUNT(reviews.id) >= 5'),
            order: [[sequelize.literal('averageRating'), 'DESC']],
            limit
        });
    }
} 