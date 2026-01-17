/**
 * Authentication Setup
 * 
 * Creates authenticated session for tests that require login.
 * Stores auth state to be reused across tests.
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';

  // Navigate to login page
  await page.goto('/login');

  // Fill in login form
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  // Submit form
  await page.getByRole('button', { name: /sign in|login|log in/i }).click();

  // Wait for successful login - adjust based on your app
  await expect(page).toHaveURL(/dashboard|home/i, { timeout: 10000 });

  // Verify user is logged in
  await expect(page.getByText(/welcome|dashboard/i)).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
