"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const AppError_1 = require("../utils/AppError");
const services_1 = require("../services");
exports.register = (0, AppError_1.catchAsync)(async (req, res) => {
    const { user, token } = await services_1.userService.register(req.body);
    res.status(201).json({ status: 'success', user, token });
});
exports.login = (0, AppError_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await services_1.userService.login(email, password);
    res.status(200).json({ status: 'success', user, token });
});
exports.getMe = (0, AppError_1.catchAsync)(async (req, res) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
});
exports.updateProfile = (0, AppError_1.catchAsync)(async (req, res) => {
    const user = await services_1.userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', user });
});
exports.changePassword = (0, AppError_1.catchAsync)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await services_1.userService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
});
