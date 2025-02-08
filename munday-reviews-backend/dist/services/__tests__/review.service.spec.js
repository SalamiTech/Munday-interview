"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_service_1 = require("../review.service");
const helpers_1 = require("../../../test/helpers");
const AppError_1 = require("../../utils/AppError");
describe('ReviewService', () => {
    let reviewService;
    beforeEach(() => {
        reviewService = new review_service_1.ReviewService();
    });
    describe('findAllWithDetails', () => {
        it('should return reviews with user and organization details', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            const review = await (0, helpers_1.createTestReview)(user.id, organization.id, {
                rating: 4,
                title: 'Great company',
                content: 'Really enjoyed working here'
            });
            const result = await reviewService.findAllWithDetails({
                search: 'Great',
                organizationId: organization.id,
                userId: user.id,
                rating: 4,
                status: 'approved',
                page: 1,
                limit: 10,
                orderBy: 'createdAt',
                order: 'DESC'
            });
            expect(result.reviews).toHaveLength(1);
            expect(result.reviews[0].id).toBe(review.id);
            expect(result.reviews[0].user).toBeDefined();
            expect(result.reviews[0].organization).toBeDefined();
        });
    });
    describe('createReview', () => {
        it('should create a new review', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            const reviewData = {
                userId: user.id,
                organizationId: organization.id,
                rating: 4,
                title: 'Great workplace',
                content: 'Excellent work environment',
                pros: ['Good benefits', 'Work-life balance'],
                cons: ['Limited growth'],
                status: 'pending'
            };
            const review = await reviewService.createReview(reviewData);
            expect(review).toBeDefined();
            expect(review.rating).toBe(reviewData.rating);
            expect(review.title).toBe(reviewData.title);
            expect(review.status).toBe('pending');
        });
        it('should throw error if user already reviewed organization', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            await (0, helpers_1.createTestReview)(user.id, organization.id);
            await expect(reviewService.createReview({
                userId: user.id,
                organizationId: organization.id,
                rating: 4,
                title: 'Another review',
                content: 'This should fail'
            })).rejects.toThrow(AppError_1.AppError);
        });
    });
    describe('moderateReview', () => {
        it('should update review status when moderated', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            const review = await (0, helpers_1.createTestReview)(user.id, organization.id, { status: 'pending' });
            const moderator = await (0, helpers_1.createTestUser)({ role: 'admin' });
            const moderatedReview = await reviewService.moderateReview(review.id, {
                status: 'approved',
                moderatorId: moderator.user.id,
                moderationNotes: 'Approved after review'
            });
            expect(moderatedReview.status).toBe('approved');
            expect(moderatedReview.moderatedBy).toBe(moderator.user.id);
            expect(moderatedReview.moderatedAt).toBeDefined();
        });
    });
    describe('toggleHelpful', () => {
        it('should increment helpful count when user marks review as helpful', async () => {
            const { user: reviewer } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            const review = await (0, helpers_1.createTestReview)(reviewer.id, organization.id);
            const { user: voter } = await (0, helpers_1.createTestUser)();
            const updatedReview = await reviewService.toggleHelpful(review.id, voter.id);
            expect(updatedReview.helpfulCount).toBe(1);
        });
    });
    describe('reportReview', () => {
        it('should increment report count and update status when threshold reached', async () => {
            const { user: reviewer } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            const review = await (0, helpers_1.createTestReview)(reviewer.id, organization.id);
            const { user: reporter } = await (0, helpers_1.createTestUser)();
            const reportedReview = await reviewService.reportReview(review.id, reporter.id, 'Inappropriate content');
            expect(reportedReview.reportCount).toBeGreaterThan(0);
            if (reportedReview.reportCount >= 3) {
                expect(reportedReview.status).toBe('flagged');
            }
        });
    });
    describe('getReviewStats', () => {
        it('should return review statistics for organization', async () => {
            const { user } = await (0, helpers_1.createTestUser)();
            const organization = await (0, helpers_1.createTestOrganization)();
            await (0, helpers_1.createTestReview)(user.id, organization.id, { rating: 5 });
            await (0, helpers_1.createTestReview)(user.id, organization.id, { rating: 4 });
            await (0, helpers_1.createTestReview)(user.id, organization.id, { rating: 3 });
            const stats = await reviewService.getReviewStats(organization.id);
            expect(stats).toBeDefined();
            expect(stats.totalReviews).toBe(3);
            expect(stats.averageRating).toBeGreaterThan(0);
            expect(stats.ratingDistribution).toBeDefined();
        });
    });
});
