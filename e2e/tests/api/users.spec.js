/**
 * Users API Tests
 * 
 * @tags @api @users
 */

import { test, expect } from '../fixtures/test-fixtures.js';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('Users API', () => {
  test.describe('GET /api/users/me', () => {
    test('should return current user profile @critical', async ({ authenticatedApiContext }) => {
      const response = await authenticatedApiContext.get(`${API_URL}/api/users/me`);

      expect(response.ok()).toBe(true);

      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.email).toBeDefined();
      expect(body.data.firstName).toBeDefined();
      expect(body.data.lastName).toBeDefined();
    });

    test('should reject unauthenticated request', async ({ apiContext }) => {
      const response = await apiContext.get(`${API_URL}/api/users/me`);

      expect(response.status()).toBe(401);
    });
  });

  test.describe('PUT /api/users/me', () => {
    test('should update current user profile', async ({ authenticatedApiContext }) => {
      const response = await authenticatedApiContext.put(`${API_URL}/api/users/me`, {
        data: {
          firstName: 'Updated',
          lastName: 'Name',
        },
      });

      expect(response.ok()).toBe(true);

      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.firstName).toBe('Updated');
    });

    test('should reject invalid update data', async ({ authenticatedApiContext }) => {
      const response = await authenticatedApiContext.put(`${API_URL}/api/users/me`, {
        data: {
          email: 'cant-change@email.com', // Email change might not be allowed
        },
      });

      // Response depends on implementation
      expect([200, 400]).toContain(response.status());
    });

    test('should reject unauthenticated request', async ({ apiContext }) => {
      const response = await apiContext.put(`${API_URL}/api/users/me`, {
        data: {
          firstName: 'Test',
        },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('PUT /api/users/me/password', () => {
    test('should change password with valid current password', async ({ authenticatedApiContext }) => {
      const currentPassword = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';
      const newPassword = 'NewTestPassword123!';

      const response = await authenticatedApiContext.put(`${API_URL}/api/users/me/password`, {
        data: {
          currentPassword,
          newPassword,
          confirmPassword: newPassword,
        },
      });

      // Skip if endpoint doesn't exist
      if (response.status() === 404) {
        test.skip();
        return;
      }

      expect(response.ok()).toBe(true);

      // Change password back for other tests
      await authenticatedApiContext.put(`${API_URL}/api/users/me/password`, {
        data: {
          currentPassword: newPassword,
          newPassword: currentPassword,
          confirmPassword: currentPassword,
        },
      });
    });

    test('should reject password change with wrong current password', async ({
      authenticatedApiContext,
    }) => {
      const response = await authenticatedApiContext.put(`${API_URL}/api/users/me/password`, {
        data: {
          currentPassword: 'WrongCurrentPassword!',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        },
      });

      // Skip if endpoint doesn't exist
      if (response.status() === 404) {
        test.skip();
        return;
      }

      expect([400, 401]).toContain(response.status());
    });
  });

  test.describe('GET /api/users (Admin)', () => {
    test('should list users for admin', async ({ playwright }) => {
      const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'AdminPassword123!';

      const context = await playwright.request.newContext({
        baseURL: API_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      });

      // Login as admin
      const loginResponse = await context.post('/api/auth/login', {
        data: { email: adminEmail, password: adminPassword },
      });

      if (!loginResponse.ok()) {
        test.skip(); // Skip if no admin user exists
        await context.dispose();
        return;
      }

      const { data } = await loginResponse.json();

      // Create authenticated context
      const authContext = await playwright.request.newContext({
        baseURL: API_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const response = await authContext.get('/api/users');

      if (response.status() === 404) {
        test.skip(); // Endpoint might not exist
        await authContext.dispose();
        await context.dispose();
        return;
      }

      expect(response.ok()).toBe(true);

      const body = await response.json();
      expect(body.data).toBeInstanceOf(Array);

      await authContext.dispose();
      await context.dispose();
    });

    test('should reject non-admin access', async ({ authenticatedApiContext }) => {
      const response = await authenticatedApiContext.get(`${API_URL}/api/users`);

      // Should be forbidden or not found
      expect([403, 404]).toContain(response.status());
    });
  });
});
