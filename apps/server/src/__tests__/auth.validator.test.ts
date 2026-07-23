import { loginSchema, registerSchema } from '../validators/auth.validator';

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        body: { email: 'test@test.com', password: 'Password1!' }
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        body: { email: 'not-an-email', password: 'Password1!' }
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should reject passwords that do not meet complexity', () => {
      const result = registerSchema.safeParse({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@test.com',
          password: 'weak',
          confirmPassword: 'weak'
        }
      });
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@test.com',
          password: 'StrongPassword1!',
          confirmPassword: 'StrongPassword2!'
        }
      });
      expect(result.success).toBe(false);
    });
  });
});
