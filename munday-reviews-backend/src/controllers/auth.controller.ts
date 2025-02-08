import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/AppError';
import { userService } from '../services';

export const register = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ status: 'success', user, token });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await userService.login(email, password);
    res.status(200).json({ status: 'success', user, token });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', user });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
}); 