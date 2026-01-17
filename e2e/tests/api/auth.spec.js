/**
 * Authentication API Tests
 * 
 * @tags @api @auth
 */

import { test, expect } from '../fixtures/test-fixtures.js';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('Auth API', () => {
  test.describe('POST /api/auth/register', () => {
    test('should register new user successfully', async ({ apiContext, testUser }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/register`, {
        data: testUser,
      });

      // Could be 201 or 200 depending on implementation
      expect([200, 201]).toContain(response.status());

      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toBeDefined();
    });

    test('should reject registration with missing fields', async ({ apiContext }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/register`, {
        data: {
          email: 'incomplete@example.com',
          // Missing other required fields
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('fail');
    });

    test('should reject registration with invalid email', async ({ apiContext, testUser }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/register`, {
        data: {
          ...testUser,
          email: 'not-an-email',
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should reject registration with weak password', async ({ apiContext, testUser }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/register`, {
        data: {
          ...testUser,
          password: '123',
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should reject duplicate email registration', async ({ apiContext }) => {
      const existingEmail = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';

      const response = await apiContext.post(`${API_URL}/api/auth/register`, {
        data: {
          firstName: 'Duplicate',
          lastName: 'User',
          email: existingEmail,
          password: 'TestPassword123!',
        },
      });

      expect([400, 409]).toContain(response.status());
    });
  });

  test.describe('POST /api/auth/login', () => {
    test('should login with valid credentials @critical', async ({ apiContext }) => {
      const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
      const password = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';

      const response = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: { email, password },
      });

      expect(response.ok()).toBe(true);

      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });

    test('should reject login with wrong password', async ({ apiContext }) => {
      const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';

      const response = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: {
          email,
          password: 'WrongPassword123!',
        },
      });

      expect(response.status()).toBe(401);
    });

    test('should reject login with non-existent email', async ({ apiContext }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        },
      });

      expect(response.status()).toBe(401);
    });

    test('should reject login with missing fields', async ({ apiContext }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: {
          email: 'test@example.com',
          // Missing password
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('POST /api/auth/refresh', () => {
    test('should refresh access token with valid refresh token', async ({ apiContext }) => {
      // First login to get tokens
      const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
      const password = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';

      const loginResponse = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: { email, password },
      });

      if (!loginResponse.ok()) {
        test.skip();
        return;
      }

      const { data } = await loginResponse.json();
      const { refreshToken } = data;

      // Now refresh the token
      const refreshResponse = await apiContext.post(`${API_URL}/api/auth/refresh`, {
        data: { refreshToken },
      });

      expect(refreshResponse.ok()).toBe(true);

      const refreshBody = await refreshResponse.json();
      expect(refreshBody.data.accessToken).toBeDefined();
    });

    test('should reject invalid refresh token', async ({ apiContext }) => {
      const response = await apiContext.post(`${API_URL}/api/auth/refresh`, {
        data: {
          refreshToken: 'invalid-refresh-token',
        },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('POST /api/auth/logout', () => {
    test('should logout successfully', async ({ authenticatedApiContext }) => {
      const response = await authenticatedApiContext.post(`${API_URL}/api/auth/logout`);

      expect(response.ok()).toBe(true);
    });
  });
});
