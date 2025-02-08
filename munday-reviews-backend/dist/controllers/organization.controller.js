"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopOrganizations = exports.getOrganizationStats = exports.verifyOrganization = exports.deleteOrganization = exports.updateOrganization = exports.createOrganization = exports.getOrganization = exports.getAllOrganizations = void 0;
const AppError_1 = require("../utils/AppError");
const services_1 = require("../services");
// Get all organizations with filtering, sorting, and pagination
exports.getAllOrganizations = (0, AppError_1.catchAsync)(async (req, res) => {
    const result = await services_1.organizationService.findAllWithStats(req.query);
    res.status(200).json({ status: 'success', ...result });
});
// Get single organization
exports.getOrganization = (0, AppError_1.catchAsync)(async (req, res) => {
    const organization = await services_1.organizationService.findById(parseInt(req.params.id));
    res.status(200).json({ status: 'success', organization });
});
// Create organization
exports.createOrganization = (0, AppError_1.catchAsync)(async (req, res) => {
    const organization = await services_1.organizationService.create(req.body);
    res.status(201).json({ status: 'success', organization });
});
// Update organization
exports.updateOrganization = (0, AppError_1.catchAsync)(async (req, res) => {
    const organization = await services_1.organizationService.update(parseInt(req.params.id), req.body);
    res.status(200).json({ status: 'success', organization });
});
// Delete organization (soft delete)
exports.deleteOrganization = (0, AppError_1.catchAsync)(async (req, res) => {
    await services_1.organizationService.delete(parseInt(req.params.id));
    res.status(204).json({ status: 'success', data: null });
});
// Verify organization
exports.verifyOrganization = (0, AppError_1.catchAsync)(async (req, res) => {
    const organization = await services_1.organizationService.verifyOrganization(parseInt(req.params.id), req.user.id);
    res.status(200).json({ status: 'success', organization });
});
// Get organization statistics
exports.getOrganizationStats = (0, AppError_1.catchAsync)(async (req, res) => {
    const stats = await services_1.organizationService.getOrganizationStats();
    res.status(200).json({ status: 'success', stats });
});
// Get top organizations
exports.getTopOrganizations = (0, AppError_1.catchAsync)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const organizations = await services_1.organizationService.getTopOrganizations(limit);
    res.status(200).json({ status: 'success', organizations });
});
