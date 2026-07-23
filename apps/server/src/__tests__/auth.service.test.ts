import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { AppError } from '../utils/ErrorBuilder';
import { Role, Status } from '@prisma/client';

jest.mock('../repositories/user.repository');
jest.mock('../repositories/token.repository');
jest.mock('../utils/password.util');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw an error if email is already in use', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(AuthService.register({ email: 'test@test.com' })).rejects.toThrow(AppError);
    });

    it('should hash password and create user', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (PasswordUtil.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (UserRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        role: Role.VIEWER,
      });

      const result = await AuthService.register({
        email: 'test@test.com',
        password: 'Password1!',
      });

      expect(result.email).toBe('test@test.com');
      expect(UserRepository.create).toHaveBeenCalled();
    });
  });
});
