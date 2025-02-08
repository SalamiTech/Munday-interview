import { Table, Model, Column, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { BaseAttributes } from '../interfaces/base.interface';
import { Review } from './review.model';
import { User } from './user.model';

interface OrganizationAttributes extends BaseAttributes {
    name: string;
    description?: string;
    website?: string;
    logo?: string;
    industry?: string;
    size?: string;
    location?: string;
    isVerified: boolean;
    verifiedBy?: number;
    verifiedAt?: Date;
}

@Table({
    tableName: 'organizations',
    paranoid: true,
    timestamps: true
})
export class Organization extends Model<OrganizationAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    name!: string;

    @Column({
        type: DataType.TEXT
    })
    description?: string;

    @Column({
        type: DataType.STRING,
        validate: {
            isUrl: true
        }
    })
    website?: string;

    @Column({
        type: DataType.STRING
    })
    logo?: string;

    @Column({
        type: DataType.STRING
    })
    industry?: string;

    @Column({
        type: DataType.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
    })
    size?: string;

    @Column({
        type: DataType.STRING
    })
    location?: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isVerified!: boolean;

    @Column({
        type: DataType.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    })
    verifiedBy?: number;

    @Column({
        type: DataType.DATE
    })
    verifiedAt?: Date;

    @HasMany(() => Review)
    reviews!: Review[];

    @BelongsTo(() => User, 'verifiedBy')
    verifier?: User;
} 