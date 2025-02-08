import { Request, Response } from 'express';
import { catchAsync } from '../utils/AppError';
import { organizationService } from '../services';

// Get all organizations with filtering, sorting, and pagination
export const getAllOrganizations = catchAsync(async (req: Request, res: Response) => {
    const result = await organizationService.findAllWithStats(req.query);
    res.status(200).json({ status: 'success', ...result });
});

// Get single organization
export const getOrganization = catchAsync(async (req: Request, res: Response) => {
    const organization = await organizationService.findById(parseInt(req.params.id));
    res.status(200).json({ status: 'success', organization });
});

// Create organization
export const createOrganization = catchAsync(async (req: Request, res: Response) => {
    const organization = await organizationService.create(req.body);
    res.status(201).json({ status: 'success', organization });
});

// Update organization
export const updateOrganization = catchAsync(async (req: Request, res: Response) => {
    const organization = await organizationService.update(parseInt(req.params.id), req.body);
    res.status(200).json({ status: 'success', organization });
});

// Delete organization (soft delete)
export const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
    await organizationService.delete(parseInt(req.params.id));
    res.status(204).json({ status: 'success', data: null });
});

// Verify organization
export const verifyOrganization = catchAsync(async (req: Request, res: Response) => {
    const organization = await organizationService.verifyOrganization(
        parseInt(req.params.id),
        req.user.id
    );
    res.status(200).json({ status: 'success', organization });
});

// Get organization statistics
export const getOrganizationStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await organizationService.getOrganizationStats();
    res.status(200).json({ status: 'success', stats });
});

// Get top organizations
export const getTopOrganizations = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const organizations = await organizationService.getTopOrganizations(limit);
    res.status(200).json({ status: 'success', organizations });
}); 