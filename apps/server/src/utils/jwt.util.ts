import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key-for-dev-only';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-for-dev-only';

export const JWT_ACCESS_EXPIRATION = '15m'; // 15 minutes
export const JWT_REFRESH_EXPIRATION = '7d'; // 7 days
export const JWT_REFRESH_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface TokenPayload {
  userId: string;
  role: string;
}

export class JwtUtil {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  }
}
