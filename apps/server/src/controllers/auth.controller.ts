import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { JWT_REFRESH_EXPIRATION_MS } from '../utils/jwt.util';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserRepository } from '../repositories/user.repository';
import { sanitizeUser } from '../services/auth.service';
import { AppError } from '../utils/ErrorBuilder';
import { PasswordUtil } from '../utils/password.util';
import { TokenRepository } from '../repositories/token.repository';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: JWT_REFRESH_EXPIRATION_MS,
  });
};

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);
    res.status(201).json(ResponseBuilder.success({ user }, 'Registration successful'));
  }

  static async login(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(200).json(ResponseBuilder.success({ user, accessToken }, 'Login successful'));
  }

  static async refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new AppError('Refresh token missing', 401);
    }

    const { accessToken, refreshToken } = await AuthService.refresh(token);
    setRefreshCookie(res, refreshToken);
    res.status(200).json(ResponseBuilder.success({ accessToken }, 'Token refreshed'));
  }

  static async logout(req: AuthRequest, res: Response) {
    const token = req.cookies?.refreshToken;
    if (token && req.user) {
      await AuthService.logout(req.user.id, token);
    }
    res.clearCookie('refreshToken');
    res.status(200).json(ResponseBuilder.success(null, 'Logged out successfully'));
  }

  static async forgotPassword(req: Request, res: Response) {
    await AuthService.forgotPassword(req.body.email);
    res.status(200).json(ResponseBuilder.success(null, 'If an account exists, a reset link was sent'));
  }

  static async resetPassword(req: Request, res: Response) {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.status(200).json(ResponseBuilder.success(null, 'Password reset successfully'));
  }

  static async getMe(req: AuthRequest, res: Response) {
    const user = await UserRepository.findById(req.user!.id);
    if (!user) throw new AppError('User not found', 404);
    res.status(200).json(ResponseBuilder.success({ user: sanitizeUser(user) }));
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    const user = await UserRepository.update(req.user!.id, req.body);
    res.status(200).json(ResponseBuilder.success({ user: sanitizeUser(user) }, 'Profile updated'));
  }

  static async changePassword(req: AuthRequest, res: Response) {
    const user = await UserRepository.findById(req.user!.id);
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await PasswordUtil.comparePassword(req.body.currentPassword, user.passwordHash);
    if (!isMatch) throw new AppError('Invalid current password', 400);

    const passwordHash = await PasswordUtil.hashPassword(req.body.newPassword);
    await UserRepository.update(req.user!.id, { passwordHash });
    await TokenRepository.revokeAllUserTokens(req.user!.id);
    res.clearCookie('refreshToken');

    res.status(200).json(ResponseBuilder.success(null, 'Password changed successfully. Please login again.'));
  }

  static async deleteAccount(req: AuthRequest, res: Response) {
    await UserRepository.delete(req.user!.id);
    res.clearCookie('refreshToken');
    res.status(200).json(ResponseBuilder.success(null, 'Account deleted successfully'));
  }
}
