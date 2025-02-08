"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../models");
const base_service_1 = require("./base.service");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
class UserService extends base_service_1.BaseService {
    constructor() {
        super(models_1.User);
    }
    async register(data) {
        // Check if user exists
        const existingUser = await models_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError_1.AppError('Email already exists', 400);
        }
        // Create user
        const user = await models_1.User.create({
            ...data,
            role: 'user',
            isActive: true
        });
        // Generate token
        const token = (0, jwt_1.generateToken)(user);
        return { user, token };
    }
    async login(email, password) {
        // Find user
        const user = await models_1.User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            throw new AppError_1.AppError('Invalid email or password', 401);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError('Invalid email or password', 401);
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate token
        const token = (0, jwt_1.generateToken)(user);
        // Remove password from response
        user.password = undefined;
        return { user, token };
    }
    async updateProfile(userId, data) {
        const user = await models_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        // Update user
        Object.assign(user, data);
        await user.save();
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await models_1.User.findById(userId).select('+password');
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new AppError_1.AppError('Current password is incorrect', 401);
        }
        // Update password
        user.password = newPassword;
        await user.save();
    }
    async getMe(userId) {
        const user = await models_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        return user;
    }
}
exports.UserService = UserService;
