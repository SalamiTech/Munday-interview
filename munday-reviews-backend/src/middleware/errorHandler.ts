import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            message: 'Invalid token. Please log in again.'
        });
    }

    if (err instanceof TokenExpiredError) {
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