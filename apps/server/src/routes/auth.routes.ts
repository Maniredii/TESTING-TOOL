import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateRequest } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as Validators from '../validators/auth.validator';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Public Routes
router.post('/register', authLimiter, validateRequest(Validators.registerSchema), asyncHandler(AuthController.register));
router.post('/login', authLimiter, validateRequest(Validators.loginSchema), asyncHandler(AuthController.login));
router.post('/refresh', asyncHandler(AuthController.refresh));
router.post('/forgot-password', authLimiter, validateRequest(Validators.forgotPasswordSchema), asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', authLimiter, validateRequest(Validators.resetPasswordSchema), asyncHandler(AuthController.resetPassword));

// Protected Routes
router.use(authMiddleware);
router.post('/logout', asyncHandler(AuthController.logout));
router.get('/me', asyncHandler(AuthController.getMe));
router.patch('/profile', validateRequest(Validators.updateProfileSchema), asyncHandler(AuthController.updateProfile));
router.patch('/password', validateRequest(Validators.changePasswordSchema), asyncHandler(AuthController.changePassword));
router.delete('/account', asyncHandler(AuthController.deleteAccount));

export default router;
