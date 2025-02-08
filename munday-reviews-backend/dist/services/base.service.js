"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const AppError_1 = require("../utils/AppError");
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async findAll(options = {}) {
        const { where, page = 1, limit = 10, order = [['createdAt', 'DESC']], include = [] } = options;
        const offset = (page - 1) * limit;
        const { count, rows } = await this.model.findAndCountAll({
            where,
            limit,
            offset,
            order,
            include,
            distinct: true
        });
        return {
            items: rows,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit
        };
    }
    async findById(id, options = {}) {
        const item = await this.model.findByPk(id, options);
        if (!item) {
            throw new AppError_1.AppError(`${this.model.name} not found with id ${id}`, 404);
        }
        return item;
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(id, data) {
        const item = await this.findById(id);
        return item.update(data);
    }
    async delete(id) {
        const item = await this.findById(id);
        await item.destroy();
        return true;
    }
    async count(where = {}) {
        return this.model.count({ where });
    }
}
exports.BaseService = BaseService;
