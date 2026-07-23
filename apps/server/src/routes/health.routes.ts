import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

// Basic health check
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(ResponseBuilder.success({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'OK',
  }, 'API is healthy'));
});

// Database health check
router.get('/database', asyncHandler(async (req: Request, res: Response) => {
  // Simple query to verify DB connection
  await prisma.$queryRaw`SELECT 1`;
  
  res.status(200).json(ResponseBuilder.success({
    database: 'Connected',
    timestamp: new Date().toISOString(),
  }, 'Database is healthy'));
}));

export default router;
