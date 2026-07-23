import { JwtUtil, TokenPayload } from '../utils/jwt.util';

describe('JwtUtil', () => {
  const payload: TokenPayload = { userId: '123', role: 'ADMIN' };

  it('should generate and verify an access token', () => {
    const token = JwtUtil.generateAccessToken(payload);
    expect(token).toBeDefined();

    const decoded = JwtUtil.verifyAccessToken(token);
    expect(decoded.userId).toBe('123');
    expect(decoded.role).toBe('ADMIN');
  });

  it('should generate and verify a refresh token', () => {
    const token = JwtUtil.generateRefreshToken(payload);
    expect(token).toBeDefined();

    const decoded = JwtUtil.verifyRefreshToken(token);
    expect(decoded.userId).toBe('123');
    expect(decoded.role).toBe('ADMIN');
  });
});
