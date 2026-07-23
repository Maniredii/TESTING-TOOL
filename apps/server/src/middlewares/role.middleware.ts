import { Response, NextFunction } from 'express';
import { AppError } from '../utils/ErrorBuilder';
import { AuthRequest } from './auth.middleware';
import { Role } from '@prisma/client';

export const restrictTo = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
