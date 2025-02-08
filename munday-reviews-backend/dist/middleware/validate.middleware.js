"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = require("../utils/AppError");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new AppError_1.AppError(errorMessages.join('. '), 400));
    }
    next();
};
exports.validateRequest = validateRequest;
