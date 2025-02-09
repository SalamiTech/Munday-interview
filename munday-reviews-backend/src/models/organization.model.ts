import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Review } from './review.model';

export interface OrganizationAttributes {
    id: number;
    name: string;
    description: string;
    industry: string;
    location: string;
    employeeCount: number;
    website?: string;
    logo?: string;
    status: 'active' | 'inactive';
    averageRating: number;
    reviewCount: number;
    averageSalary?: number;
    interviewSuccessRate: number;
    verifiedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface OrganizationCreationAttributes extends Omit<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export class Organization extends Model<OrganizationAttributes, OrganizationCreationAttributes> {
    declare id: number;
    declare name: string;
    declare description: string;
    declare industry: string;
    declare location: string;
    declare employeeCount: number;
    declare website?: string;
    declare logo?: string;
    declare status: 'active' | 'inactive';
    declare averageRating: number;
    declare reviewCount: number;
    declare averageSalary?: number;
    declare interviewSuccessRate: number;
    declare verifiedBy?: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date | null;

    static associate(models: { User: typeof User; Review: typeof Review }) {
        Organization.hasMany(models.Review, {
            foreignKey: 'organizationId',
            as: 'reviews'
        });
        Organization.belongsTo(models.User, {
            foreignKey: 'verifiedBy',
            as: 'verifier'
        });
    }

    static initialize(sequelize: Sequelize) {
        Organization.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            industry: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            employeeCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },
            averageRating: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            reviewCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            averageSalary: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            interviewSuccessRate: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            verifiedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'organizations',
            timestamps: true,
            paranoid: true,
            underscored: true,
        });
    }
}

export type OrganizationModel = typeof Organization; 