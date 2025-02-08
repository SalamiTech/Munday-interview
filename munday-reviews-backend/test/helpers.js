"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestReview = exports.createTestOrganization = exports.createTestAdmin = exports.createTestUser = void 0;
const models_1 = require("../src/models");
const jwt_1 = require("../src/utils/jwt");
const createTestUser = async (data = {}) => {
    const defaultData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
    };
    const user = await models_1.User.create({ ...defaultData, ...data });
    const token = (0, jwt_1.generateToken)(user);
    return { user, token };
};
exports.createTestUser = createTestUser;
const createTestAdmin = async () => {
    return (0, exports.createTestUser)({
        email: 'admin@example.com',
        role: 'admin'
    });
};
exports.createTestAdmin = createTestAdmin;
const createTestOrganization = async (data = {}) => {
    const defaultData = {
        name: 'Test Organization',
        description: 'A test organization',
        industry: 'Technology',
        size: '11-50',
        location: 'Test City'
    };
    return models_1.Organization.create({ ...defaultData, ...data });
};
exports.createTestOrganization = createTestOrganization;
const createTestReview = async (userId, organizationId, data = {}) => {
    const defaultData = {
        title: 'Test Review',
        content: 'This is a test review content',
        rating: 4,
        status: 'pending'
    };
    return models_1.Review.create({
        ...defaultData,
        ...data,
        userId,
        organizationId
    });
};
exports.createTestReview = createTestReview;
