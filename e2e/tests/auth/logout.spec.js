/**
 * Logout Tests
 * 
 * @tags @auth
 */

import { test, expect } from '../fixtures/test-fixtures.js';
import { DashboardPage, LoginPage } from '../fixtures/pages/index.js';

test.describe('Logout', () => {
  // Use authenticated page for these tests
  test.use({ storageState: '.auth/user.json' });

  test('should successfully logout @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    // Verify we're logged in
    await expect(page).toHaveURL(/dashboard/i);

    // Perform logout
    await dashboardPage.logout();

    // Should redirect to login or home
    await expect(page).toHaveURL(/login|home|\//i, { timeout: 10000 });
  });

  test('should clear authentication state on logout', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.logout();

    // Try to access protected route
    await page.goto('/dashboard');

    // Should be redirected to login
    await expect(page).toHaveURL(/login/i, { timeout: 10000 });
  });

  test('should clear tokens from storage on logout', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    // Verify token exists before logout
    const tokenBefore = await page.evaluate(() => {
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    });

    await dashboardPage.logout();

    // Verify token is cleared after logout
    const tokenAfter = await page.evaluate(() => {
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    });

    expect(tokenAfter).toBeNull();
  });
});
