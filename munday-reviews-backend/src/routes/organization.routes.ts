import { Router } from 'express';
import { Organization } from '../models';
import { auth } from '../middleware/auth';

const router = Router();

// Get all organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await Organization.findAll({
            where: req.query
        });
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch organizations' });
    }
});

// Get single organization
router.get('/:id', async (req, res) => {
    try {
        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch organization' });
    }
});

// Create organization
router.post('/', auth, async (req, res) => {
    try {
        const organization = await Organization.create(req.body);
        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create organization' });
    }
});

// Update organization
router.patch('/:id', auth, async (req, res) => {
    try {
        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        await organization.update(req.body);
        res.json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update organization' });
    }
});

// Delete organization
router.delete('/:id', auth, async (req, res) => {
    try {
        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        await organization.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete organization' });
    }
});

export default router; 