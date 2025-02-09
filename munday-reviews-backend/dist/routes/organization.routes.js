"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await models_1.Organization.findAll({
            where: req.query
        });
        res.json(organizations);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch organizations' });
    }
});
// Get single organization
router.get('/:id', async (req, res) => {
    try {
        const organization = await models_1.Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch organization' });
    }
});
// Create organization
router.post('/', auth_1.auth, async (req, res) => {
    try {
        const organization = await models_1.Organization.create(req.body);
        res.status(201).json(organization);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create organization' });
    }
});
// Update organization
router.patch('/:id', auth_1.auth, async (req, res) => {
    try {
        const organization = await models_1.Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        await organization.update(req.body);
        res.json(organization);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update organization' });
    }
});
// Delete organization
router.delete('/:id', auth_1.auth, async (req, res) => {
    try {
        const organization = await models_1.Organization.findByPk(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        await organization.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete organization' });
    }
});
exports.default = router;
