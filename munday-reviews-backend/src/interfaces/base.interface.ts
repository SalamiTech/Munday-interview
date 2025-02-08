import { Document } from 'mongoose';

export interface BaseDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
}

export interface BaseAttributes {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface BaseModelAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
} 