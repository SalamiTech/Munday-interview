"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../user.service");
const helpers_1 = require("../../../test/helpers");
const AppError_1 = require("../../utils/AppError");
const models_1 = require("../../models");
describe('UserService', () => {
    let userService;
    beforeEach(() => {
        userService = new user_service_1.UserService();
    });
    describe('register', () => {
        it('should create a new user and return token', async () => {
            const userData = {
                email: 'new@example.com',
                password: 'Password123!',
                firstName: 'New',
                lastName: 'User'
            };
            const result = await userService.register(userData);
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.email).toBe(userData.email);
            expect(result.user.firstName).toBe(userData.firstName);
            expect(result.user.lastName).toBe(userData.lastName);
        });
        it('should throw error if email already exists', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            await expect(userService.register({
                email: user.email,
                password: 'Password123!',
                firstName: 'Test',
                lastName: 'User'
            })).rejects.toThrow(AppError_1.AppError);
        });
    });
    describe('login', () => {
        it('should login user and return token', async () => {
            const password = 'Password123!';
            const { user } = await (0, helpers_1.createTestUser)({ password });
            const result = await userService.login(user.email, password);
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.id).toBe(user.id);
        });
        it('should throw error if email not found', async () => {
            await expect(userService.login('nonexistent@example.com', 'Password123!')).rejects.toThrow(AppError_1.AppError);
        });
        it('should throw error if password is incorrect', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            await expect(userService.login(user.email, 'WrongPassword123!')).rejects.toThrow(AppError_1.AppError);
        });
    });
    describe('updateProfile', () => {
        it('should update user profile', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name'
            };
            const updatedUser = await userService.updateProfile(user.id, updateData);
            expect(updatedUser.firstName).toBe(updateData.firstName);
            expect(updatedUser.lastName).toBe(updateData.lastName);
            expect(updatedUser.fullName).toBe(`${updateData.firstName} ${updateData.lastName}`);
        });
    });
    describe('changePassword', () => {
        it('should change user password', async () => {
            const oldPassword = 'Password123!';
            const newPassword = 'NewPassword123!';
            const { user } = await (0, helpers_1.createTestUser)({ password: oldPassword });
            await userService.changePassword(user.id, oldPassword, newPassword);
            const updatedUser = await models_1.User.findByPk(user.id);
            expect(await updatedUser.comparePassword(newPassword)).toBe(true);
        });
        it('should throw error if current password is incorrect', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            await expect(userService.changePassword(user.id, 'WrongPassword123!', 'NewPassword123!')).rejects.toThrow(AppError_1.AppError);
        });
    });
});
