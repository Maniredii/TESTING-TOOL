import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './utils/Environment';
import { logger } from './utils/Logger';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { connectWithRetry } from './config/database';
import { setupGracefulShutdown } from './config/shutdown';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import testConfigRoutes from './routes/testConfig.routes';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5174', // Vite default port
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(requestLogger);
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes (Versioning)
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/projects`, projectRoutes);
app.use(`${API_PREFIX}/test-configurations`, testConfigRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectWithRetry();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  setupGracefulShutdown(server);
};

startServer();

