"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const models_1 = require("../models");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const protect = async (req, res, next) => {
    var _a;
    try {
        // 1) Get token from header
        let token;
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        // 2) Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        // 3) Check if user still exists
        const user = await models_1.User.findByPk(decoded.id);
        if (!user || user.deletedAt) {
            return next(new AppError_1.AppError('The user belonging to this token no longer exists.', 401));
        }
        // 4) Check if user is active
        if (!user.isActive) {
            return next(new AppError_1.AppError('Your account has been deactivated. Please contact support.', 401));
        }
        // Grant access to protected route
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
