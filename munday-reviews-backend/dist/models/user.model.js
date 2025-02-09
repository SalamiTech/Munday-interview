"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User extends sequelize_1.Model {
    async comparePassword(candidatePassword) {
        if (!this.password)
            return false;
        return bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    toJSON() {
        const values = super.toJSON();
        delete values.password;
        return values;
    }
    static initialize(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                set(value) {
                    const salt = bcryptjs_1.default.genSaltSync(10);
                    this.setDataValue('password', bcryptjs_1.default.hashSync(value, salt));
                },
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            fullName: {
                type: sequelize_1.DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                },
            },
            avatar: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user',
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            lastLogin: {
                type: sequelize_1.DataTypes.DATE,
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
    static associate(models) {
        // Define associations here if needed
    }
}
exports.User = User;
