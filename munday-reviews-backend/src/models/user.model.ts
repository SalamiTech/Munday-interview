import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
    id: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'fullName' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare email: string;
    declare password?: string;
    declare firstName: string;
    declare lastName: string;
    declare fullName?: string;
    declare avatar?: string;
    declare role: 'user' | 'admin';
    declare isActive: boolean;
    declare lastLogin?: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    async comparePassword(candidatePassword: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(candidatePassword, this.password);
    }

    toJSON(): Partial<UserAttributes> {
        const values = super.toJSON() as UserAttributes;
        delete values.password;
        return values;
    }

    static initialize(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value: string) {
                    const salt = bcrypt.genSaltSync(10);
                    this.setDataValue('password', bcrypt.hashSync(value, salt));
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                },
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'users',
            timestamps: true,
            defaultScope: {
                attributes: { exclude: ['password'] },
            },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] },
                },
            },
        });
    }

    static associate(models: any) {
        // Define associations here if needed
    }
}

export type UserModel = typeof User; 