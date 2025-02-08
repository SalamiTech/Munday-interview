"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const models_1 = require("../models");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class OrganizationService extends base_service_1.BaseService {
    constructor() {
        super(models_1.Organization);
    }
    async findAllWithStats(options) {
        const { search, industry, size, page = 1, limit = 10, order = 'name:asc' } = options;
        const where = {};
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { description: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        if (industry)
            where.industry = industry;
        if (size)
            where.size = size;
        const [orderField, orderDirection] = order.split(':');
        return this.findAll({
            where,
            page,
            limit,
            order: [[orderField, orderDirection.toUpperCase()]],
            include: [{
                    model: models_1.Review,
                    attributes: []
                }]
        });
    }
    async getOrganizationStats() {
        const stats = await this.model.findAll({
            attributes: [
                'industry',
                [database_1.default.fn('COUNT', database_1.default.col('id')), 'count'],
                [database_1.default.fn('AVG', database_1.default.col('reviews.rating')), 'averageRating'],
                [database_1.default.fn('COUNT', database_1.default.col('reviews.id')), 'totalReviews']
            ],
            include: [{
                    model: models_1.Review,
                    attributes: []
                }],
            group: ['industry']
        });
        return stats;
    }
    async verifyOrganization(id, adminId) {
        const organization = await this.findById(id);
        if (organization.isVerified) {
            throw new AppError_1.AppError('Organization is already verified', 400);
        }
        await organization.update({
            isVerified: true,
            verifiedBy: adminId,
            verifiedAt: new Date()
        });
        return organization;
    }
    async getTopOrganizations(limit = 5) {
        return this.model.findAll({
            include: [{
                    model: models_1.Review,
                    attributes: []
                }],
            attributes: [
                'id',
                'name',
                'industry',
                [database_1.default.fn('AVG', database_1.default.col('reviews.rating')), 'averageRating'],
                [database_1.default.fn('COUNT', database_1.default.col('reviews.id')), 'totalReviews']
            ],
            group: ['Organization.id'],
            having: database_1.default.literal('COUNT(reviews.id) >= 5'),
            order: [[database_1.default.literal('averageRating'), 'DESC']],
            limit
        });
    }
}
exports.OrganizationService = OrganizationService;
