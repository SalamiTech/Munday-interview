import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface JwtPayload {
    id: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}; 