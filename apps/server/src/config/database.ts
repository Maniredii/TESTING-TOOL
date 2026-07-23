import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/Logger';

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export const connectWithRetry = async (retries = 5, interval = 5000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      logger.info('✅ Successfully connected to the database.');
      return;
    } catch (error: any) {
      logger.error(`Database connection failed (Attempt ${i + 1}/${retries}): ${error.message}`);
      if (i < retries - 1) {
        logger.info(`Retrying in ${interval / 1000} seconds...`);
        await new Promise(res => setTimeout(res, interval));
      } else {
        logger.error('❌ Could not connect to the database after maximum retries. Exiting.');
        process.exit(1);
      }
    }
  }
};
