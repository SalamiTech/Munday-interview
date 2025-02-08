import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from '../utils/AppError';
import { verifyToken, JwtPayload } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: User;
            token?: string;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) Get token from header
        let token: string | undefined;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verify token
        const decoded = verifyToken(token);

        // 3) Check if user still exists
        const user = await User.findByPk(decoded.id);
        if (!user || user.deletedAt) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // 4) Check if user is active
        if (!user.isActive) {
            return next(new AppError('Your account has been deactivated. Please contact support.', 401));
        }

        // Grant access to protected route
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
}; 