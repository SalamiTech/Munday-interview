import { Router, Request, Response } from 'express';
import { Organization } from '../models';
import { Op, WhereOptions } from 'sequelize';
import { auth } from '../middleware/auth';
import { validateOrganization } from '../middleware/validate.middleware';

type OrganizationStatus = 'active' | 'inactive';

interface OrganizationWhereOptions {
    status?: OrganizationStatus;
    industry?: string;
    location?: string;
    name?: { [Op.like]: string };
    deletedAt?: null;
}

const router = Router();

// Get top organizations
router.get('/top', async (req: Request, res: Response) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 5, 20); // Cap at 20
        const where: OrganizationWhereOptions = {
            status: 'active',
            deletedAt: null
        };

        const organizations = await Organization.findAll({
            where: where as WhereOptions<any>,
            attributes: [
                'id', 'name', 'industry', 'location', 'logo',
                'averageRating', 'reviewCount', 'website'
            ],
            order: [
                ['averageRating', 'DESC'],
                ['reviewCount', 'DESC']
            ],
            limit
        });

        res.json(organizations);
    } catch (error) {
        console.error('Error fetching top organizations:', error);
        res.status(500).json({ message: 'Failed to fetch top organizations', error: (error as Error).message });
    }
});

// Get all organizations with filtering
router.get('/', async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', industry, location, keyword } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        const where: OrganizationWhereOptions = { 
            status: 'active',
            deletedAt: null
        };

        if (industry) where.industry = industry as string;
        if (location) where.location = location as string;
        if (keyword) {
            where.name = { [Op.like]: `%${keyword}%` };
        }

        const { count, rows } = await Organization.findAndCountAll({
            where: where as WhereOptions<any>,
            order: [['name', 'ASC']],
            limit: limitNum,
            offset
        });

        res.json({
            items: rows,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
            hasMore: pageNum * limitNum < count
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ message: 'Failed to fetch organizations', error: (error as Error).message });
    }
});

// Get single organization
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ message: 'Failed to fetch organization', error: (error as Error).message });
    }
});

// Protected routes below
router.use(auth);

// Create organization
router.post('/', validateOrganization, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const organization = await Organization.create({
            ...req.body,
            verifiedBy: req.user.id,
            status: 'active'
        });

        res.status(201).json(organization);
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ message: 'Failed to create organization', error: (error as Error).message });
    }
});

// Update organization
router.patch('/:id', validateOrganization, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await organization.update(req.body);
        res.json(organization);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ message: 'Failed to update organization', error: (error as Error).message });
    }
});

// Delete organization
router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await organization.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({ message: 'Failed to delete organization', error: (error as Error).message });
    }
});

export default router; 