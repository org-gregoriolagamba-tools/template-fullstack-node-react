/**
 * Test Fixtures
 * 
 * Custom fixtures for extending Playwright's test capabilities.
 */

import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate random user data
 */
export function generateUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'TestPassword123!',
  };
}

/**
 * Custom test fixtures
 */
export const test = base.extend({
  // Fixture for authenticated page
  authenticatedPage: async ({ browser }, use) => {
    const authFile = path.join(__dirname, '../.auth/user.json');
    const context = await browser.newContext({
      storageState: authFile,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Fixture for generating test user
  testUser: async ({}, use) => {
    const user = generateUser();
    await use(user);
  },

  // Fixture for API context
  apiContext: async ({ playwright }, use) => {
    const apiURL = process.env.E2E_API_URL || 'http://localhost:3001';
    const context = await playwright.request.newContext({
      baseURL: apiURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    await use(context);
    await context.dispose();
  },

  // Fixture for authenticated API context
  authenticatedApiContext: async ({ playwright }, use) => {
    const apiURL = process.env.E2E_API_URL || 'http://localhost:3001';
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';

    const context = await playwright.request.newContext({
      baseURL: apiURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    // Login to get token
    const loginResponse = await context.post('/api/auth/login', {
      data: { email, password },
    });

    if (loginResponse.ok()) {
      const { data } = await loginResponse.json();
      // Create new context with auth header
      await context.dispose();
      const authContext = await playwright.request.newContext({
        baseURL: apiURL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.accessToken}`,
        },
      });
      await use(authContext);
      await authContext.dispose();
    } else {
      await use(context);
      await context.dispose();
    }
  },
});

export { expect };
