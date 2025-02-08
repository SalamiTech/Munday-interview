import { Table, Model, Column, DataType, BeforeCreate, BeforeUpdate, BeforeSave } from 'sequelize-typescript';
import { BaseAttributes } from '../interfaces/base.interface';
import bcrypt from 'bcryptjs';

interface UserAttributes extends BaseAttributes {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin?: Date;
}

@Table({
    tableName: 'users',
    paranoid: true,
    timestamps: true
})
export class User extends Model<UserAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lastName!: string;

    @Column({
        type: DataType.STRING
    })
    fullName!: string;

    @Column({
        type: DataType.STRING
    })
    avatar?: string;

    @Column({
        type: DataType.ENUM('user', 'admin'),
        defaultValue: 'user'
    })
    role!: 'user' | 'admin';

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isActive!: boolean;

    @Column({
        type: DataType.DATE
    })
    lastLogin?: Date;

    @BeforeSave
    static async hashPassword(instance: User) {
        if (instance.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, salt);
        }
    }

    @BeforeSave
    static setFullName(instance: User) {
        instance.fullName = `${instance.firstName} ${instance.lastName}`;
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
} 