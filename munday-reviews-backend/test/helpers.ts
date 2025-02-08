import { User, Organization, Review } from '../src/models';
import { generateToken } from '../src/utils/jwt';

export const createTestUser = async (data: Partial<User> = {}) => {
    const defaultData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
    };

    const user = await User.create({ ...defaultData, ...data });
    const token = generateToken(user);

    return { user, token };
};

export const createTestAdmin = async () => {
    return createTestUser({
        email: 'admin@example.com',
        role: 'admin'
    });
};

export const createTestOrganization = async (data: Partial<Organization> = {}) => {
    const defaultData = {
        name: 'Test Organization',
        description: 'A test organization',
        industry: 'Technology',
        size: '11-50',
        location: 'Test City'
    };

    return Organization.create({ ...defaultData, ...data });
};

export const createTestReview = async (
    userId: number,
    organizationId: number,
    data: Partial<Review> = {}
) => {
    const defaultData = {
        title: 'Test Review',
        content: 'This is a test review content',
        rating: 4,
        status: 'pending'
    };

    return Review.create({
        ...defaultData,
        ...data,
        userId,
        organizationId
    });
}; 