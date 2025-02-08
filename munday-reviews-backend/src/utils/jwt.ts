import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AppError } from './AppError';

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export const generateToken = (user: User): string => {
    const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Your token has expired! Please log in again.', 401);
        }
        throw new AppError('Invalid token! Please log in again.', 401);
    }
}; 