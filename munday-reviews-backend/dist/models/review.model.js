"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
class Review extends sequelize_1.Model {
    static associate(models) {
        Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Review.belongsTo(models.Organization, { foreignKey: 'organizationId', as: 'organization' });
    }
    async getStats() {
        const stats = await Review.findOne({
            where: { organizationId: this.organizationId },
            attributes: [
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'totalReviews'],
                [sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('rating')), 'averageRating'],
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.literal('CASE WHEN rating = 1 THEN 1 END')), 'rating1'],
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.literal('CASE WHEN rating = 2 THEN 1 END')), 'rating2'],
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.literal('CASE WHEN rating = 3 THEN 1 END')), 'rating3'],
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.literal('CASE WHEN rating = 4 THEN 1 END')), 'rating4'],
                [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.literal('CASE WHEN rating = 5 THEN 1 END')), 'rating5']
            ],
            raw: true
        });
        const result = stats;
        return {
            totalReviews: Number((result === null || result === void 0 ? void 0 : result.totalReviews) || 0),
            averageRating: Number((result === null || result === void 0 ? void 0 : result.averageRating) || 0),
            ratingDistribution: {
                1: Number((result === null || result === void 0 ? void 0 : result.rating1) || 0),
                2: Number((result === null || result === void 0 ? void 0 : result.rating2) || 0),
                3: Number((result === null || result === void 0 ? void 0 : result.rating3) || 0),
                4: Number((result === null || result === void 0 ? void 0 : result.rating4) || 0),
                5: Number((result === null || result === void 0 ? void 0 : result.rating5) || 0)
            }
        };
    }
    static initialize(sequelize) {
        Review.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            rating: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            pros: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
                get() {
                    const rawValue = this.getDataValue('pros');
                    return Array.isArray(rawValue) ? rawValue : [];
                },
                set(value) {
                    this.setDataValue('pros', Array.isArray(value) ? value : []);
                }
            },
            cons: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
                get() {
                    const rawValue = this.getDataValue('cons');
                    return Array.isArray(rawValue) ? rawValue : [];
                },
                set(value) {
                    this.setDataValue('cons', Array.isArray(value) ? value : []);
                }
            },
            isAnonymous: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
            },
            helpfulCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            reportCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            organizationId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'organizations',
                    key: 'id',
                },
            },
        }, {
            sequelize,
            tableName: 'reviews',
            timestamps: true,
        });
    }
}
exports.Review = Review;
