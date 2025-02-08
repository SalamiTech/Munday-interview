import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseAttributes } from '../interfaces/base.interface';
import { User } from './user.model';
import { Organization } from './organization.model';

interface ReviewAttributes extends BaseAttributes {
    title?: string;
    content: string;
    rating: number;
    pros?: string[];
    cons?: string[];
    status: 'pending' | 'approved' | 'rejected';
    helpfulCount: number;
    reportCount: number;
    isAnonymous: boolean;
    userId: number;
    organizationId: number;
    moderatorId?: number;
    moderatedAt?: Date;
    moderationNotes?: string;
}

@Table({
    tableName: 'reviews',
    paranoid: true,
    timestamps: true
})
export class Review extends Model<ReviewAttributes> {
    @Column({
        type: DataType.STRING
    })
    title?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    content!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    })
    rating!: number;

    @Column({
        type: DataType.ARRAY(DataType.STRING)
    })
    pros?: string[];

    @Column({
        type: DataType.ARRAY(DataType.STRING)
    })
    cons?: string[];

    @Column({
        type: DataType.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    })
    status!: 'pending' | 'approved' | 'rejected';

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    helpfulCount!: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    reportCount!: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isAnonymous!: boolean;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId!: number;

    @ForeignKey(() => Organization)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    organizationId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    moderatorId?: number;

    @Column({
        type: DataType.DATE
    })
    moderatedAt?: Date;

    @Column({
        type: DataType.TEXT
    })
    moderationNotes?: string;

    @BelongsTo(() => User, 'userId')
    user!: User;

    @BelongsTo(() => Organization, 'organizationId')
    organization!: Organization;

    @BelongsTo(() => User, 'moderatorId')
    moderator?: User;
} 