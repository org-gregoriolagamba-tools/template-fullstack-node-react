/**
 * JWT Utils Tests
 */

import { 
  generateAccessToken, 
  generateRefreshToken, 
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken 
} from '../../src/utils/jwt.utils.js';

// Mock the config module
jest.mock('../../src/config/index.js', () => ({
  default: {
    jwtSecret: 'test-jwt-secret-key-for-testing',
    jwtExpiresIn: '1h',
    jwtRefreshSecret: 'test-refresh-secret-key-for-testing',
    jwtRefreshExpiresIn: '7d',
  },
}));

describe('JWT Utils', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken({ id: mockUser._id, email: mockUser.email });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken({ id: mockUser._id });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const tokens = generateTokenPair(mockUser);
      
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = generateAccessToken({ id: mockUser._id, email: mockUser.email });
      const decoded = verifyAccessToken(token);
      
      expect(decoded.id).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken({ id: mockUser._id });
      const decoded = verifyRefreshToken(token);
      
      expect(decoded.id).toBe(mockUser._id);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = generateAccessToken({ id: mockUser._id });
      const decoded = decodeToken(token);
      
      expect(decoded.id).toBe(mockUser._id);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
