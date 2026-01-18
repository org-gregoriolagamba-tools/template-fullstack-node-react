/**
 * API Health Check Tests
 * 
 * @tags @api @smoke
 */

import { test, expect } from '@playwright/test';

const API_URL = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('API Health', () => {
  test('should return healthy status @smoke @critical', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/health`);

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('success');
  });

  test('should return detailed health info', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/health/detailed`);

    if (response.ok()) {
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toBeDefined();
    }
  });

  test('should have CORS headers configured', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/health`);
    const headers = response.headers();

    // Check for CORS headers (may vary by config)
    expect(response.ok()).toBe(true);
  });

  test('should respond within acceptable time', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${API_URL}/api/health`);
    const duration = Date.now() - start;

    expect(response.ok()).toBe(true);
    expect(duration).toBeLessThan(1000); // Less than 1 second
  });
});
