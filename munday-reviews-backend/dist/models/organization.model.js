"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const sequelize_1 = require("sequelize");
class Organization extends sequelize_1.Model {
    static associate(models) {
        Organization.hasMany(models.Review, {
            foreignKey: 'organizationId',
            as: 'reviews'
        });
        Organization.belongsTo(models.User, {
            foreignKey: 'verifiedBy',
            as: 'verifier'
        });
    }
    static initialize(sequelize) {
        Organization.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            industry: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            employeeCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            website: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },
            averageRating: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            reviewCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            averageSalary: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true,
            },
            interviewSuccessRate: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            verifiedBy: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        }, {
            sequelize,
            tableName: 'organizations',
            timestamps: true,
        });
    }
}
exports.Organization = Organization;
