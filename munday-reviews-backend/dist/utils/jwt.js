"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("./AppError");
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError_1.AppError('Your token has expired! Please log in again.', 401);
        }
        throw new AppError_1.AppError('Invalid token! Please log in again.', 401);
    }
};
exports.verifyToken = verifyToken;
