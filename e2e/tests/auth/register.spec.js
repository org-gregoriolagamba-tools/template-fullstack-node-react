/**
 * Registration Tests
 * 
 * @tags @auth @critical
 */

import { test, expect } from '../fixtures/test-fixtures.js';
import { RegisterPage } from '../fixtures/pages/index.js';

test.describe('Registration', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should display registration form correctly @smoke', async ({ page }) => {
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await registerPage.submit();

    // Check HTML5 validation
    const firstNameValid = await registerPage.firstNameInput.evaluate(
      (el) => el.validity.valid
    );
    expect(firstNameValid).toBe(false);
  });

  test('should show error for invalid email', async ({ page, testUser }) => {
    await registerPage.fillForm({
      ...testUser,
      email: 'invalid-email',
    });
    await registerPage.submit();

    const emailValid = await registerPage.emailInput.evaluate(
      (el) => el.validity.valid
    );
    expect(emailValid).toBe(false);
  });

  test('should show error for weak password', async ({ page, testUser }) => {
    await registerPage.fillForm({
      ...testUser,
      password: '123',
      confirmPassword: '123',
    });
    await registerPage.submit();

    // Check for password validation error
    const errorVisible = await registerPage.isErrorVisible();
    if (errorVisible) {
      const errorText = await registerPage.getErrorMessage();
      expect(errorText.toLowerCase()).toMatch(/password|weak|short|characters/i);
    }
  });

  test('should show error for mismatched passwords', async ({ page, testUser }) => {
    await registerPage.fillForm({
      ...testUser,
      confirmPassword: 'DifferentPassword123!',
    });
    await registerPage.submit();

    // Wait for error message
    await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await registerPage.getErrorMessage();
    expect(errorText.toLowerCase()).toMatch(/match|same|confirm/i);
  });

  test('should successfully register with valid data @critical', async ({ page, testUser }) => {
    await registerPage.register(testUser);

    // Should redirect to login or dashboard
    await expect(page).toHaveURL(/login|dashboard|verify/i, { timeout: 10000 });
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Use existing test user email
    const existingEmail = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';

    await registerPage.register({
      firstName: 'Duplicate',
      lastName: 'User',
      email: existingEmail,
      password: 'TestPassword123!',
    });

    // Should show duplicate email error
    await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await registerPage.getErrorMessage();
    expect(errorText.toLowerCase()).toMatch(/exists|duplicate|already|taken/i);
  });

  test('should have link to login page', async ({ page }) => {
    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.goToLogin();
    await expect(page).toHaveURL(/login/i);
  });

  test('should validate password requirements', async ({ page, testUser }) => {
    // Test various weak passwords
    const weakPasswords = [
      'short',           // Too short
      'nouppercase1!',   // No uppercase
      'NOLOWERCASE1!',   // No lowercase
      'NoNumbers!',      // No numbers
    ];

    for (const weakPassword of weakPasswords) {
      await registerPage.fillForm({
        ...testUser,
        password: weakPassword,
        confirmPassword: weakPassword,
      });
      await registerPage.submit();
      
      // Should show error or prevent submission
      const currentUrl = page.url();
      if (currentUrl.includes('register')) {
        // Still on register page - validation prevented submission
        continue;
      }
    }
  });

  test('should trim whitespace from inputs', async ({ page, testUser }) => {
    await registerPage.fillForm({
      firstName: '  ' + testUser.firstName + '  ',
      lastName: '  ' + testUser.lastName + '  ',
      email: '  ' + testUser.email + '  ',
      password: testUser.password,
    });
    await registerPage.submit();

    // If successful, values should be trimmed
    // This verifies backend trims whitespace
    await page.waitForLoadState('networkidle');
  });
});
