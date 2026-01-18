/**
 * Dashboard Tests (Authenticated)
 * 
 * @tags @dashboard @authenticated
 */

import { test, expect } from '../fixtures/test-fixtures.js';
import { DashboardPage } from '../fixtures/pages/index.js';

test.describe('Dashboard', () => {
  // Use authenticated state
  test.use({ storageState: '.auth/user.json' });

  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
  });

  test('should display dashboard for authenticated user @smoke', async ({ page }) => {
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });

  test('should display user navigation', async ({ page }) => {
    await expect(dashboardPage.navigation).toBeVisible();
  });

  test('should show user profile link', async ({ page }) => {
    await expect(dashboardPage.profileLink).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    await dashboardPage.goToProfile();
    await expect(page).toHaveURL(/profile/i);
  });

  test('should display user information', async ({ page }) => {
    // Look for user-related information on page
    const userInfo = page.getByText(/email|name|welcome/i);
    await expect(userInfo.first()).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(dashboardPage.welcomeMessage).toBeVisible();

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.welcomeMessage).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });

  test('should handle page refresh', async ({ page }) => {
    await page.reload();
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });
});

test.describe('Dashboard - Unauthenticated', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear any stored authentication
    await page.context().clearCookies();
    
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/login/i, { timeout: 10000 });
  });
});
