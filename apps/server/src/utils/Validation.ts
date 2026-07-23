import { ZodSchema, ZodError } from 'zod';
import { AppError } from './ErrorBuilder';

export class ValidationUtil {
  static validate(schema: ZodSchema, data: any) {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError('Validation Error', 400, error.issues);
      }
      throw error;
    }
  }
}
