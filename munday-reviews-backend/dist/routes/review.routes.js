"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await models_1.Review.findAll({
            where: req.query,
            include: ['user', 'organization']
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});
// Get single review
router.get('/:id', async (req, res) => {
    try {
        const review = await models_1.Review.findByPk(req.params.id, {
            include: ['user', 'organization']
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch review' });
    }
});
// Create review
router.post('/', auth_1.auth, async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const review = await models_1.Review.create({
            ...req.body,
            userId: req.user.id,
            status: 'pending'
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create review' });
    }
});
// Update review
router.patch('/:id', auth_1.auth, async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const review = await models_1.Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await review.update(req.body);
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update review' });
    }
});
// Delete review
router.delete('/:id', auth_1.auth, async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const review = await models_1.Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await review.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete review' });
    }
});
exports.default = router;
