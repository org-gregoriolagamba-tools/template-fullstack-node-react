/**
 * Homepage Tests
 * 
 * @tags @smoke @critical
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly @smoke @critical', async ({ page }) => {
    // Check page loaded
    await expect(page).toHaveTitle(/react|app/i);

    // Check main heading is visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check navigation is present
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Check login link exists
    const loginLink = page.getByRole('link', { name: /login|sign in/i });
    await expect(loginLink).toBeVisible();

    // Check register link exists
    const registerLink = page.getByRole('link', { name: /register|sign up/i });
    await expect(registerLink).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /login|sign in/i }).click();
    await expect(page).toHaveURL(/login/i);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: /register|sign up/i }).click();
    await expect(page).toHaveURL(/register/i);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be usable
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should load without console errors @smoke', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (e.g., favicon)
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
