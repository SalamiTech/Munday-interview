"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = exports.Review = exports.User = void 0;
exports.initializeModels = initializeModels;
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const review_model_1 = require("./review.model");
Object.defineProperty(exports, "Review", { enumerable: true, get: function () { return review_model_1.Review; } });
const organization_model_1 = require("./organization.model");
Object.defineProperty(exports, "Organization", { enumerable: true, get: function () { return organization_model_1.Organization; } });
const database_1 = __importDefault(require("../config/database"));
const models = {
    User: user_model_1.User,
    Review: review_model_1.Review,
    Organization: organization_model_1.Organization
};
async function initializeModels() {
    try {
        // Initialize each model with sequelize instance
        Object.values(models).forEach(model => {
            if (typeof model.initialize === 'function') {
                model.initialize(database_1.default);
            }
        });
        // Set up associations
        Object.values(models).forEach(model => {
            if (typeof model.associate === 'function') {
                model.associate(models);
            }
        });
        console.log('Models initialized successfully');
    }
    catch (error) {
        console.error('Error initializing models:', error);
        throw error;
    }
}
exports.default = models;
