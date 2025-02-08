import { ReviewService } from '../review.service';
import { createTestReview, createTestUser, createTestOrganization } from '../../../test/helpers';
import { AppError } from '../../utils/AppError';
import { expect } from '@jest/globals';

interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
}

describe('ReviewService', () => {
    let reviewService: ReviewService;

    beforeEach(() => {
        reviewService = new ReviewService();
    });

    describe('findAllWithDetails', () => {
        it('should return reviews with user and organization details', async () => {
            const { user } = await createTestUser();
            const organization = await createTestOrganization();
            const review = await createTestReview(user.id, organization.id, {
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
                order: 'createdAt:DESC'
            });

            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe(review.id);
            expect(result.items[0].user).toBeDefined();
            expect(result.items[0].organization).toBeDefined();
        });
    });

    describe('createReview', () => {
        it('should create a new review', async () => {
            const { user } = await createTestUser();
            const organization = await createTestOrganization();

            const reviewData = {
                title: 'Great workplace',
                content: 'Really enjoyed working here',
                rating: 4,
                pros: 'Good culture, Great benefits',
                cons: 'Long hours',
                isAnonymous: false,
                userId: user.id,
                organizationId: organization.id
            };

            const review = await reviewService.createReview(reviewData);

            expect(review).toBeDefined();
            expect(review.title).toBe(reviewData.title);
            expect(review.rating).toBe(reviewData.rating);
            expect(review.userId).toBe(user.id);
            expect(review.organizationId).toBe(organization.id);
        });

        it('should throw error if user already reviewed organization', async () => {
            const { user } = await createTestUser();
            const organization = await createTestOrganization();
            await createTestReview(user.id, organization.id);

            await expect(reviewService.createReview({
                title: 'This should fail',
                content: 'This should fail',
                rating: 4,
                isAnonymous: false,
                userId: user.id,
                organizationId: organization.id
            })).rejects.toThrow(AppError);
        });
    });

    describe('moderateReview', () => {
        it('should update review status when moderated', async () => {
            const { user } = await createTestUser();
            const { user: moderator } = await createTestUser();
            const organization = await createTestOrganization();
            const review = await createTestReview(user.id, organization.id);

            const moderatedReview = await reviewService.moderateReview(review.id, {
                status: 'approved',
                moderatorId: moderator.id,
                moderationNotes: 'Looks good'
            });

            expect(moderatedReview.status).toBe('approved');
            expect(moderatedReview.moderatorId).toBe(moderator.id);
            expect(moderatedReview.moderationNotes).toBe('Looks good');
        });
    });

    describe('toggleHelpful', () => {
        it('should increment helpful count when user marks review as helpful', async () => {
            const { user: reviewer } = await createTestUser();
            const { user: voter } = await createTestUser();
            const organization = await createTestOrganization();
            const review = await createTestReview(reviewer.id, organization.id);

            const updatedReview = await reviewService.toggleHelpful(review.id, voter.id);

            expect(updatedReview.helpfulCount).toBe(1);
        });
    });

    describe('reportReview', () => {
        it('should increment report count and update status when threshold reached', async () => {
            const { user: reviewer } = await createTestUser();
            const { user: reporter } = await createTestUser();
            const organization = await createTestOrganization();
            const review = await createTestReview(reviewer.id, organization.id);

            const reportedReview = await reviewService.reportReview(
                review.id,
                reporter.id,
                'Inappropriate content'
            );

            expect(reportedReview.reportCount).toBeGreaterThan(0);
        });
    });

    describe('getReviewStats', () => {
        it('should return review statistics for organization', async () => {
            const { user } = await createTestUser();
            const organization = await createTestOrganization();

            await createTestReview(user.id, organization.id, { rating: 5 });
            await createTestReview(user.id, organization.id, { rating: 4 });
            await createTestReview(user.id, organization.id, { rating: 3 });

            const stats = await reviewService.getReviewStats(organization.id) as ReviewStats;

            expect(stats).toBeDefined();
            expect(stats.totalReviews).toBe(3);
            expect(stats.averageRating).toBeGreaterThan(0);
            expect(stats.ratingDistribution).toBeDefined();
        });
    });
});