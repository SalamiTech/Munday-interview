"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof sequelize_1.ValidationError) {
        return res.status(400).json({
            message: err.message
        });
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        return res.status(401).json({
            message: 'Invalid token. Please log in again.'
        });
    }
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return res.status(401).json({
            message: 'Your token has expired. Please log in again.'
        });
    }
    // Default error
    res.status(500).json({
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
