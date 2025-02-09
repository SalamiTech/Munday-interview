import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';
import { Organization } from './organization.model';

export interface ReviewAttributes {
    id: number;
    title: string;
    content: string;
    rating: number;
    pros: string[];
    cons: string[];
    isAnonymous: boolean;
    status: 'pending' | 'approved' | 'rejected';
    helpfulCount: number;
    reportCount: number;
    userId: number;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
    organization?: Organization;
}

export interface ReviewCreationAttributes extends Omit<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'organization'> {}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
    declare id: number;
    declare title: string;
    declare content: string;
    declare rating: number;
    declare pros: string[];
    declare cons: string[];
    declare isAnonymous: boolean;
    declare status: 'pending' | 'approved' | 'rejected';
    declare helpfulCount: number;
    declare reportCount: number;
    declare userId: number;
    declare organizationId: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare user?: User;
    declare organization?: Organization;

    static associate(models: { User: typeof User; Organization: typeof Organization }) {
        Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Review.belongsTo(models.Organization, { foreignKey: 'organizationId', as: 'organization' });
    }

    async getStats(): Promise<ReviewStats> {
        const stats = await Review.findOne({
            where: { organizationId: this.organizationId },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReviews'],
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN rating = 1 THEN 1 END')), 'rating1'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN rating = 2 THEN 1 END')), 'rating2'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN rating = 3 THEN 1 END')), 'rating3'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN rating = 4 THEN 1 END')), 'rating4'],
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN rating = 5 THEN 1 END')), 'rating5']
            ],
            raw: true
        });

        const result = stats as any;
        return {
            totalReviews: Number(result?.totalReviews || 0),
            averageRating: Number(result?.averageRating || 0),
            ratingDistribution: {
                1: Number(result?.rating1 || 0),
                2: Number(result?.rating2 || 0),
                3: Number(result?.rating3 || 0),
                4: Number(result?.rating4 || 0),
                5: Number(result?.rating5 || 0)
            }
        };
    }

    static initialize(sequelize: Sequelize) {
        Review.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            pros: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
                get(): string[] {
                    const rawValue = this.getDataValue('pros');
                    return Array.isArray(rawValue) ? rawValue : [];
                },
                set(value: string[]) {
                    this.setDataValue('pros', Array.isArray(value) ? value : []);
                }
            },
            cons: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [],
                get(): string[] {
                    const rawValue = this.getDataValue('cons');
                    return Array.isArray(rawValue) ? rawValue : [];
                },
                set(value: string[]) {
                    this.setDataValue('cons', Array.isArray(value) ? value : []);
                }
            },
            isAnonymous: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
            },
            helpfulCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            reportCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            organizationId: {
                type: DataTypes.INTEGER,
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

export type ReviewModel = typeof Review; 