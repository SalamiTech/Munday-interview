import { OrganizationService } from '../organization.service';
import { createTestOrganization, createTestUser, createTestAdmin, createTestReview } from '../../../test/helpers';
import { AppError } from '../../utils/AppError';
import { Organization } from '../../models';
import { expect } from '@jest/globals';

describe('OrganizationService', () => {
    let organizationService: OrganizationService;

    beforeEach(() => {
        organizationService = new OrganizationService();
    });

    describe('findAllWithStats', () => {
        it('should return organizations with stats and filters', async () => {
            const org1 = await createTestOrganization({ industry: 'Tech', size: '1-50' });
            const org2 = await createTestOrganization({ industry: 'Finance', size: '51-200' });
            const { user } = await createTestUser();
            
            await createTestReview(user.id, org1.id, { rating: 4 });
            await createTestReview(user.id, org2.id, { rating: 5 });

            const result = await organizationService.findAllWithStats({
                search: '',
                industry: 'Tech',
                size: '1-50',
                page: 1,
                limit: 10,
                order: 'avgRating:DESC'
            });

            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(org1.id);
            expect(result.items[0]).toHaveProperty('avgRating');
            expect(result.items[0]).toHaveProperty('totalReviews');
        });
    });

    describe('getOrganizationStats', () => {
        it('should return organization statistics by industry', async () => {
            const org1 = await createTestOrganization({ industry: 'Tech' });
            const org2 = await createTestOrganization({ industry: 'Finance' });
            const { user } = await createTestUser();
            
            await createTestReview(user.id, org1.id, { rating: 4 });
            await createTestReview(user.id, org2.id, { rating: 5 });

            const stats = await organizationService.getOrganizationStats();

            expect(stats).toBeDefined();
            expect(stats).toHaveLength(2);
            expect(stats.find(s => s.get('industry') === 'Tech')).toBeDefined();
            expect(stats.find(s => s.get('industry') === 'Finance')).toBeDefined();
        });
    });

    describe('verifyOrganization', () => {
        it('should verify organization when admin approves', async () => {
            const organization = await createTestOrganization({ isVerified: false });
            const { user: admin } = await createTestAdmin();

            const verifiedOrg = await organizationService.verifyOrganization(organization.id, admin.id);

            expect(verifiedOrg.isVerified).toBe(true);
            expect(verifiedOrg.verifiedBy).toBe(admin.id);
            expect(verifiedOrg.verifiedAt).toBeDefined();
        });

        it('should throw error when organization not found', async () => {
            const { user: admin } = await createTestAdmin();

            await expect(organizationService.verifyOrganization(
                999999,
                admin.id
            )).rejects.toThrow(AppError);
        });
    });

    describe('getTopOrganizations', () => {
        it('should return top rated organizations', async () => {
            const org1 = await createTestOrganization();
            const org2 = await createTestOrganization();
            const org3 = await createTestOrganization();
            const { user } = await createTestUser();

            // Create reviews with different ratings
            await createTestReview(user.id, org1.id, { rating: 5 });
            await createTestReview(user.id, org2.id, { rating: 4 });
            await createTestReview(user.id, org3.id, { rating: 3 });

            const topOrgs = await organizationService.getTopOrganizations(2);

            expect(topOrgs).toHaveLength(2);
            expect(topOrgs[0].id).toBe(org1.id);
            expect(topOrgs[1].id).toBe(org2.id);
            expect(Number(topOrgs[0].get('averageRating'))).toBeGreaterThan(Number(topOrgs[1].get('averageRating')));
        });
    });
});
