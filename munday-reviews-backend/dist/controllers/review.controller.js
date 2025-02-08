"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewStats = exports.reportReview = exports.voteReviewHelpful = exports.moderateReview = exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getAllReviews = void 0;
const AppError_1 = require("../utils/AppError");
const services_1 = require("../services");
// Get all reviews with filtering, sorting, and pagination
exports.getAllReviews = (0, AppError_1.catchAsync)(async (req, res) => {
    const result = await services_1.reviewService.findAllWithDetails(req.query);
    res.status(200).json({ status: 'success', ...result });
});
// Get single review
exports.getReview = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.findById(parseInt(req.params.id));
    res.status(200).json({ status: 'success', review });
});
// Create review
exports.createReview = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.createReview({
        ...req.body,
        userId: req.user.id
    });
    res.status(201).json({ status: 'success', review });
});
// Update review
exports.updateReview = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.update(parseInt(req.params.id), req.body);
    res.status(200).json({ status: 'success', review });
});
// Delete review (soft delete)
exports.deleteReview = (0, AppError_1.catchAsync)(async (req, res) => {
    await services_1.reviewService.delete(parseInt(req.params.id));
    res.status(204).json({ status: 'success', data: null });
});
// Moderate review (admin only)
exports.moderateReview = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.moderateReview(parseInt(req.params.id), {
        ...req.body,
        moderatorId: req.user.id
    });
    res.status(200).json({ status: 'success', review });
});
// Vote review as helpful
exports.voteReviewHelpful = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.toggleHelpful(parseInt(req.params.id), req.user.id);
    res.status(200).json({ status: 'success', review });
});
// Report review
exports.reportReview = (0, AppError_1.catchAsync)(async (req, res) => {
    const review = await services_1.reviewService.reportReview(parseInt(req.params.id), req.user.id, req.body.reason);
    res.status(200).json({ status: 'success', review });
});
exports.getReviewStats = (0, AppError_1.catchAsync)(async (req, res) => {
    const organizationId = req.query.organizationId ? parseInt(req.query.organizationId) : undefined;
    const stats = await services_1.reviewService.getReviewStats(organizationId);
    res.status(200).json({ status: 'success', stats });
});
