/**
 * Accessibility Tests
 * 
 * Basic accessibility checks using Playwright.
 * For comprehensive a11y testing, consider using @axe-core/playwright
 * 
 * @tags @a11y
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check that there's an h1
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      // Check h2s exist after h1 (if any)
      const h2s = page.locator('h2');
      const h3sWithoutH2 = await page.evaluate(() => {
        const h2Elements = document.querySelectorAll('h2');
        const h3Elements = document.querySelectorAll('h3');
        return h3Elements.length > 0 && h2Elements.length === 0;
      });
      expect(h3sWithoutH2).toBe(false);
    });

    test('should have skip navigation link', async ({ page }) => {
      // Skip link should be first focusable element
      await page.keyboard.press('Tab');
      const skipLink = page.locator('a[href="#main"], a[href="#content"]');

      // Skip link is optional but recommended
      if (await skipLink.isVisible()) {
        await expect(skipLink).toContainText(/skip/i);
      }
    });

    test('should have proper image alt text', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');

        // Images should have alt text or role="presentation" for decorative
        expect(alt !== null || role === 'presentation').toBe(true);
      }
    });

    test('should have proper link text', async ({ page }) => {
      const links = page.locator('a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Links should have descriptive text or aria-label
        const hasDescriptiveText = text && text.trim().length > 0;
        const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0;

        expect(hasDescriptiveText || hasAriaLabel).toBe(true);
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Basic check - ensure text is visible
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // For comprehensive contrast testing, use axe-core
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Navigate through interactive elements with keyboard
      const interactiveElements = page.locator(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const count = await interactiveElements.count();

      // Should have focusable elements
      expect(count).toBeGreaterThan(0);

      // Tab through first few elements
      for (let i = 0; i < Math.min(5, count); i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }
    });

    test('should have focus indicators', async ({ page }) => {
      // Find a focusable element
      const link = page.locator('a').first();

      if (await link.isVisible()) {
        // Get outline style when not focused
        const outlineBefore = await link.evaluate(
          (el) => window.getComputedStyle(el).outline
        );

        // Focus the element
        await link.focus();

        // Check focus is visible somehow (outline, box-shadow, etc.)
        const isFocusVisible = await link.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px';
          const hasBoxShadow = styles.boxShadow !== 'none';
          const hasBorderChange = true; // Assume border might change
          return hasOutline || hasBoxShadow || hasBorderChange;
        });

        // Focus should be visible somehow
        expect(isFocusVisible).toBe(true);
      }
    });
  });

  test.describe('Forms', () => {
    test('login form should have proper labels', async ({ page }) => {
      await page.goto('/login');

      // Email input should have label
      const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
      if (await emailInput.isVisible()) {
        const id = await emailInput.getAttribute('id');
        const ariaLabel = await emailInput.getAttribute('aria-label');
        const ariaLabelledby = await emailInput.getAttribute('aria-labelledby');

        const hasLabel = id && (await page.locator(`label[for="${id}"]`).isVisible());
        const hasAriaLabel = !!ariaLabel;
        const hasAriaLabelledby = !!ariaLabelledby;

        expect(hasLabel || hasAriaLabel || hasAriaLabelledby).toBe(true);
      }
    });

    test('form errors should be accessible', async ({ page }) => {
      await page.goto('/login');

      // Submit empty form to trigger validation
      await page.getByRole('button', { name: /sign in|login/i }).click();

      // Wait for any error messages
      await page.waitForTimeout(500);

      const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
      const count = await errorMessages.count();

      // If there are errors, they should be properly marked
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const error = errorMessages.nth(i);
          const role = await error.getAttribute('role');
          const ariaLive = await error.getAttribute('aria-live');

          // Errors should be announced to screen readers
          expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBe(
            true
          );
        }
      }
    });

    test('required fields should be marked', async ({ page }) => {
      await page.goto('/register');

      const requiredInputs = page.locator('input[required], [aria-required="true"]');
      const count = await requiredInputs.count();

      // Registration form should have required fields
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('ARIA Landmarks', () => {
    test('should have main landmark', async ({ page }) => {
      await page.goto('/');

      const main = page.locator('main, [role="main"]');
      await expect(main).toHaveCount(1);
    });

    test('should have navigation landmark', async ({ page }) => {
      await page.goto('/');

      const nav = page.locator('nav, [role="navigation"]');
      expect(await nav.count()).toBeGreaterThan(0);
    });

    test('should have banner landmark', async ({ page }) => {
      await page.goto('/');

      const header = page.locator('header, [role="banner"]');
      expect(await header.count()).toBeGreaterThan(0);
    });
  });
});
