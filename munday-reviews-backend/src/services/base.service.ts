import { Model, ModelCtor } from 'sequelize-typescript';
import { WhereOptions, Order, FindOptions } from 'sequelize';
import { AppError } from '../utils/AppError';

export class BaseService<T extends Model> {
    constructor(protected model: ModelCtor<T>) {}

    async findAll(options: {
        where?: WhereOptions<any>;
        page?: number;
        limit?: number;
        order?: Order;
        include?: any[];
    } = {}) {
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

    async findById(id: number, options: FindOptions = {}) {
        const item = await this.model.findByPk(id, options);
        if (!item) {
            throw new AppError(`${this.model.name} not found with id ${id}`, 404);
        }
        return item;
    }

    async create(data: Partial<T>) {
        return this.model.create(data as any);
    }

    async update(id: number, data: Partial<T>) {
        const item = await this.findById(id);
        return item.update(data);
    }

    async delete(id: number) {
        const item = await this.findById(id);
        await item.destroy();
        return true;
    }

    async count(where: WhereOptions<any> = {}) {
        return this.model.count({ where });
    }
} 