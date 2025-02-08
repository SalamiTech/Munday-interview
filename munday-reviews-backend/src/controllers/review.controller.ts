import { Request, Response } from 'express';
import { catchAsync } from '../utils/AppError';
import { reviewService } from '../services';

// Get all reviews with filtering, sorting, and pagination
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewService.findAllWithDetails(req.query);
    res.status(200).json({ status: 'success', ...result });
});

// Get single review
export const getReview = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.findById(parseInt(req.params.id));
    res.status(200).json({ status: 'success', review });
});

// Create review
export const createReview = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.createReview({
        ...req.body,
        userId: req.user.id
    });
    res.status(201).json({ status: 'success', review });
});

// Update review
export const updateReview = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.update(parseInt(req.params.id), req.body);
    res.status(200).json({ status: 'success', review });
});

// Delete review (soft delete)
export const deleteReview = catchAsync(async (req: Request, res: Response) => {
    await reviewService.delete(parseInt(req.params.id));
    res.status(204).json({ status: 'success', data: null });
});

// Moderate review (admin only)
export const moderateReview = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.moderateReview(parseInt(req.params.id), {
        ...req.body,
        moderatorId: req.user.id
    });
    res.status(200).json({ status: 'success', review });
});

// Vote review as helpful
export const voteReviewHelpful = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.toggleHelpful(parseInt(req.params.id), req.user.id);
    res.status(200).json({ status: 'success', review });
});

// Report review
export const reportReview = catchAsync(async (req: Request, res: Response) => {
    const review = await reviewService.reportReview(
        parseInt(req.params.id),
        req.user.id,
        req.body.reason
    );
    res.status(200).json({ status: 'success', review });
});

export const getReviewStats = catchAsync(async (req: Request, res: Response) => {
    const organizationId = req.query.organizationId ? parseInt(req.query.organizationId as string) : undefined;
    const stats = await reviewService.getReviewStats(organizationId);
    res.status(200).json({ status: 'success', stats });
}); 