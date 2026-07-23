import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { TokenRepository } from '../repositories/token.repository';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil, JWT_REFRESH_EXPIRATION_MS } from '../utils/jwt.util';
import { AppError } from '../utils/ErrorBuilder';
import { User, Role } from '@prisma/client';
import { logger } from '../utils/Logger';

// Helper to remove password before sending response
export const sanitizeUser = (user: User) => {
  const { passwordHash, passwordResetToken, passwordResetExpires, ...sanitized } = user;
  return sanitized;
};

export class AuthService {
  static async register(data: any) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await PasswordUtil.hashPassword(data.password);
    const user = await UserRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      avatar: data.avatar,
      role: Role.VIEWER, // Default role
    });

    return sanitizeUser(user);
  }

  static async login(data: any) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await PasswordUtil.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + JWT_REFRESH_EXPIRATION_MS);
    await TokenRepository.create(user.id, refreshToken, expiresAt);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  }

  static async refresh(token: string) {
    const storedToken = await TokenRepository.findByToken(token);
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    try {
      const decoded = JwtUtil.verifyRefreshToken(token);
      
      const payload = { userId: decoded.userId, role: decoded.role };
      const newAccessToken = JwtUtil.generateAccessToken(payload);
      const newRefreshToken = JwtUtil.generateRefreshToken(payload);

      // Revoke old token and create new one (Refresh Token Rotation)
      await TokenRepository.revokeToken(token);
      const expiresAt = new Date(Date.now() + JWT_REFRESH_EXPIRATION_MS);
      await TokenRepository.create(decoded.userId, newRefreshToken, expiresAt);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  static async logout(userId: string, token: string) {
    await TokenRepository.revokeToken(token);
  }

  static async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.update(user.id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpires: resetExpires,
    });

    // MOCK EMAIL SENDING
    logger.info(`[MOCK EMAIL] Password reset token for ${email}: ${resetToken}`);
  }

  static async resetPassword(token: string, newPassword: string) {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserRepository.findByResetToken(resetTokenHash);
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    const passwordHash = await PasswordUtil.hashPassword(newPassword);

    await UserRepository.update(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Revoke all existing refresh tokens
    await TokenRepository.revokeAllUserTokens(user.id);
  }
}
