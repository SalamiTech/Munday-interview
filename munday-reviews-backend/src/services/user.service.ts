import { User } from '../models';
import { BaseService } from './base.service';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

export class UserService extends BaseService<User> {
    constructor() {
        super(User);
    }

    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) {
        // Check if user exists
        const existingUser = await User.findOne({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        // Create user
        const user = await User.create({
            ...data,
            role: 'user',
            isActive: true
        });

        // Generate token
        const token = generateToken(user);

        return { user, token };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await User.findOne({
            where: { email },
            attributes: { include: ['password'] }
        });
        if (!user || !user.isActive) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;

        return { user: userWithoutPassword, token };
    }

    async updateProfile(userId: number, data: {
        firstName?: string;
        lastName?: string;
        avatar?: string;
    }) {
        const user = await this.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Update user
        Object.assign(user, data);
        await user.save();

        return user;
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Update password
        user.password = newPassword;
        await user.save();
    }

    async getMe(userId: number) {
        const user = await this.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }
} 