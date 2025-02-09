import { Router } from 'express';
import { Review } from '../models';
import { auth } from '../middleware/auth';

const router = Router();

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: req.query,
            include: ['user', 'organization']
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// Get single review
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id, {
            include: ['user', 'organization']
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch review' });
    }
});

// Create review
router.post('/', auth, async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.create({
            ...req.body,
            userId: req.user.id,
            status: 'pending'
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create review' });
    }
});

// Update review
router.patch('/:id', auth, async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await review.update(req.body);
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update review' });
    }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await review.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

export default router; 