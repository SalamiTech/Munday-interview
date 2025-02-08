"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const organization_service_1 = require("../organization.service");
const helpers_1 = require("../../../test/helpers");
const AppError_1 = require("../../utils/AppError");
const node_test_1 = require("node:test");
(0, node_test_1.describe)('OrganizationService', () => {
    let organizationService;
    (0, node_test_1.beforeEach)(() => {
        organizationService = new organization_service_1.OrganizationService();
    });
    (0, node_test_1.describe)('findAllWithStats', () => {
        (0, node_test_1.it)('should return organizations with stats and filters', async () => {
            const org1 = await (0, helpers_1.createTestOrganization)({ industry: 'Tech', size: '1-50' });
            const org2 = await (0, helpers_1.createTestOrganization)({ industry: 'Finance', size: '51-200' });
            const { user } = await (0, helpers_1.createTestUser)();
            await (0, helpers_1.createTestReview)(user.id, org1.id, { rating: 4 });
            await (0, helpers_1.createTestReview)(user.id, org2.id, { rating: 5 });
            const result = await organizationService.findAllWithStats({
                search: '',
                industry: 'Tech',
                size: '1-50',
                page: 1,
                limit: 10,
                orderBy: 'avgRating',
                order: 'DESC'
            });
            expect(result.organizations).toHaveLength(1);
            expect(result.organizations[0].id).toBe(org1.id);
            expect(result.organizations[0].avgRating).toBeDefined();
            expect(result.organizations[0].totalReviews).toBeDefined();
        });
    });
    (0, node_test_1.describe)('getOrganizationStats', () => {
        (0, node_test_1.it)('should return organization statistics by industry', async () => {
            const org1 = await (0, helpers_1.createTestOrganization)({ industry: 'Tech' });
            const org2 = await (0, helpers_1.createTestOrganization)({ industry: 'Finance' });
            const { user } = await (0, helpers_1.createTestUser)();
            await (0, helpers_1.createTestReview)(user.id, org1.id, { rating: 4 });
            await (0, helpers_1.createTestReview)(user.id, org2.id, { rating: 5 });
            const stats = await organizationService.getOrganizationStats();
            expect(stats).toBeDefined();
            expect(stats).toHaveLength(2);
            expect(stats.find(s => s.industry === 'Tech')).toBeDefined();
            expect(stats.find(s => s.industry === 'Finance')).toBeDefined();
        });
    });
    (0, node_test_1.describe)('verifyOrganization', () => {
        (0, node_test_1.it)('should verify organization when admin approves', async () => {
            const organization = await (0, helpers_1.createTestOrganization)({ isVerified: false });
            const { user: admin } = await (0, helpers_1.createTestAdmin)();
            const verifiedOrg = await organizationService.verifyOrganization(organization.id, admin.id);
            expect(verifiedOrg.isVerified).toBe(true);
            expect(verifiedOrg.verifiedBy).toBe(admin.id);
            expect(verifiedOrg.verifiedAt).toBeDefined();
        });
        (0, node_test_1.it)('should throw error when organization not found', async () => {
            const { user: admin } = await (0, helpers_1.createTestAdmin)();
            await expect(organizationService.verifyOrganization(999999, admin.id)).rejects.toThrow(AppError_1.AppError);
        });
    });
    (0, node_test_1.describe)('getTopOrganizations', () => {
        (0, node_test_1.it)('should return top rated organizations', async () => {
            const org1 = await (0, helpers_1.createTestOrganization)();
            const org2 = await (0, helpers_1.createTestOrganization)();
            const org3 = await (0, helpers_1.createTestOrganization)();
            const { user } = await (0, helpers_1.createTestUser)();
            // Create reviews with different ratings
            await (0, helpers_1.createTestReview)(user.id, org1.id, { rating: 5 });
            await (0, helpers_1.createTestReview)(user.id, org2.id, { rating: 4 });
            await (0, helpers_1.createTestReview)(user.id, org3.id, { rating: 3 });
            const topOrgs = await organizationService.getTopOrganizations(2);
            expect(topOrgs).toHaveLength(2);
            expect(topOrgs[0].id).toBe(org1.id);
            expect(topOrgs[1].id).toBe(org2.id);
            expect(topOrgs[0].avgRating).toBeGreaterThan(topOrgs[1].avgRating);
        });
    });
});
function expect(organizations) {
    throw new Error('Function not implemented.');
}
