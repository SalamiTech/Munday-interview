import { UserService } from '../user.service';
import { createTestUser } from '../../../test/helpers';
import { AppError } from '../../utils/AppError';
import { User } from '../../models';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
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
            const { user } = await createTestUser();

            await expect(userService.register({
                email: user.email,
                password: 'Password123!',
                firstName: 'Test',
                lastName: 'User'
            })).rejects.toThrow(AppError);
        });
    });

    describe('login', () => {
        it('should login user and return token', async () => {
            const password = 'Password123!';
            const { user } = await createTestUser({ password });

            const result = await userService.login(user.email, password);

            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.id).toBe(user.id);
        });

        it('should throw error if email not found', async () => {
            await expect(userService.login(
                'nonexistent@example.com',
                'Password123!'
            )).rejects.toThrow(AppError);
        });

        it('should throw error if password is incorrect', async () => {
            const { user } = await createTestUser();

            await expect(userService.login(
                user.email,
                'WrongPassword123!'
            )).rejects.toThrow(AppError);
        });
    });

    describe('updateProfile', () => {
        it('should update user profile', async () => {
            const { user } = await createTestUser();
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
            const { user } = await createTestUser({ password: oldPassword });

            await userService.changePassword(user.id, oldPassword, newPassword);

            const updatedUser = await User.findByPk(user.id);
            expect(await updatedUser.comparePassword(newPassword)).toBe(true);
        });

        it('should throw error if current password is incorrect', async () => {
            const { user } = await createTestUser();

            await expect(userService.changePassword(
                user.id,
                'WrongPassword123!',
                'NewPassword123!'
            )).rejects.toThrow(AppError);
        });
    });
}); 