import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/ErrorBuilder';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { logger } from '../utils/Logger';

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    // Log unexpected errors
    logger.error(`[UNEXPECTED ERROR] ${err.message}`, { stack: err.stack });
  }

  res.status(statusCode).json(ResponseBuilder.error(message, statusCode, errors));
};
