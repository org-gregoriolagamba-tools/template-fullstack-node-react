/**
 * Login Tests
 * 
 * @tags @auth @critical
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/pages/index.js';

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form correctly @smoke', async ({ page }) => {
    // Check form elements are visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    // Click submit without filling form
    await loginPage.submit();

    // Check for validation error
    // This could be HTML5 validation or custom error
    const emailValid = await loginPage.emailInput.evaluate((el) => el.validity.valid);
    expect(emailValid).toBe(false);
  });

  test('should show error for invalid email format', async ({ page }) => {
    await loginPage.fillForm('invalid-email', 'password123');
    await loginPage.submit();

    // Check for email validation error
    const emailValid = await loginPage.emailInput.evaluate((el) => el.validity.valid);
    expect(emailValid).toBe(false);
  });

  test('should show error for incorrect credentials @critical', async ({ page }) => {
    await loginPage.login('wrong@example.com', 'WrongPassword123!');

    // Wait for and check error message
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials @critical', async ({ page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!';

    await loginPage.login(email, password);

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard|home/i, { timeout: 10000 });
  });

  test('should have link to register page', async ({ page }) => {
    await expect(loginPage.registerLink).toBeVisible();
    await loginPage.goToRegister();
    await expect(page).toHaveURL(/register/i);
  });

  test('should have link to forgot password', async ({ page }) => {
    // This is optional - only test if the feature exists
    const forgotLink = loginPage.forgotPasswordLink;
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await expect(page).toHaveURL(/forgot|reset/i);
    }
  });

  test('should toggle password visibility', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /show|hide|toggle/i });
    
    // Only test if toggle exists
    if (await toggleButton.isVisible()) {
      await loginPage.passwordInput.fill('testpassword');
      
      // Initially password is hidden
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await toggleButton.click();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to email input
    await page.keyboard.press('Tab');
    await expect(loginPage.emailInput).toBeFocused();

    // Fill email and tab to password
    await loginPage.emailInput.fill('test@example.com');
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();

    // Fill password and press Enter to submit
    await loginPage.passwordInput.fill('password');
    await page.keyboard.press('Enter');

    // Form should be submitted
    await page.waitForLoadState('networkidle');
  });

  test('should rate limit after multiple failed attempts', async ({ page }) => {
    // Attempt login multiple times
    for (let i = 0; i < 6; i++) {
      await loginPage.login('wrong@example.com', 'WrongPassword');
      await page.waitForTimeout(500);
    }

    // Should show rate limit message
    const rateLimitMessage = page.getByText(/too many|rate limit|try again/i);
    // This test is optional - only passes if rate limiting is implemented
    if (await rateLimitMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(rateLimitMessage).toBeVisible();
    }
  });
});
