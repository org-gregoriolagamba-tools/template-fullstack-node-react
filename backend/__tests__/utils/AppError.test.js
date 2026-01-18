/**
 * AppError Class Tests
 */

import { AppError, createError } from '../../src/utils/AppError.js';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an error with status code 400', () => {
      const error = new AppError('Bad request', 400);
      
      expect(error.message).toBe('Bad request');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    it('should create an error with status code 500', () => {
      const error = new AppError('Server error', 500);
      
      expect(error.message).toBe('Server error');
      expect(error.statusCode).toBe(500);
      expect(error.status).toBe('error');
      expect(error.isOperational).toBe(true);
    });

    it('should be instance of Error', () => {
      const error = new AppError('Test', 400);
      expect(error).toBeInstanceOf(Error);
    });

    it('should have a stack trace', () => {
      const error = new AppError('Test', 400);
      expect(error.stack).toBeDefined();
    });
  });

  describe('createError helpers', () => {
    it('should create badRequest error (400)', () => {
      const error = createError.badRequest('Custom message');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Custom message');
    });

    it('should create unauthorized error (401)', () => {
      const error = createError.unauthorized();
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    it('should create forbidden error (403)', () => {
      const error = createError.forbidden();
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Forbidden');
    });

    it('should create notFound error (404)', () => {
      const error = createError.notFound('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should create conflict error (409)', () => {
      const error = createError.conflict();
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Conflict');
    });

    it('should create internal error (500)', () => {
      const error = createError.internal();
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });
  });
});
