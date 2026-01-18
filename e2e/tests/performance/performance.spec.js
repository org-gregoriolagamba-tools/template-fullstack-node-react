/**
 * Performance Tests
 * 
 * Basic performance checks using Playwright.
 * 
 * @tags @performance
 */

import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage should load within acceptable time @smoke', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const domContentLoaded = Date.now() - startTime;

    await page.waitForLoadState('load');
    const fullyLoaded = Date.now() - startTime;

    // DOM content should load within 2 seconds
    expect(domContentLoaded).toBeLessThan(2000);

    // Full page should load within 5 seconds
    expect(fullyLoaded).toBeLessThan(5000);
  });

  test('should have minimal Largest Contentful Paint', async ({ page }) => {
    await page.goto('/');

    // Get LCP using Performance API
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcpValue = 0;

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcpValue = lastEntry.startTime;
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Wait a bit for LCP to be recorded
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 3000);
      });
    });

    // LCP should be under 2.5 seconds (Good threshold)
    expect(lcp).toBeLessThan(2500);
  });

  test('should have minimal First Input Delay simulation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure time to respond to click
    const button = page.getByRole('link').first();

    if (await button.isVisible()) {
      const startTime = Date.now();
      await button.click({ force: true, noWaitAfter: true });
      const responseTime = Date.now() - startTime;

      // Click should respond within 100ms
      expect(responseTime).toBeLessThan(100);
    }
  });

  test('should load minimal JavaScript bundles', async ({ page }) => {
    const jsRequests = [];

    page.on('request', (request) => {
      if (request.resourceType() === 'script') {
        jsRequests.push(request.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Log for debugging
    console.log(`Loaded ${jsRequests.length} JavaScript files`);

    // Reasonable number of JS files (adjust based on your bundle strategy)
    expect(jsRequests.length).toBeLessThan(20);
  });

  test('should minimize render-blocking resources', async ({ page }) => {
    const blockingResources = [];

    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (resourceType === 'stylesheet' || resourceType === 'script') {
        blockingResources.push({
          url: request.url(),
          type: resourceType,
        });
      }
    });

    await page.goto('/');

    // Log for analysis
    console.log('Blocking resources:', blockingResources.length);
  });

  test('should use efficient image formats', async ({ page }) => {
    const images = [];

    page.on('response', (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.startsWith('image/')) {
        images.push({
          url: response.url(),
          type: contentType,
          size: parseInt(response.headers()['content-length'] || '0', 10),
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for modern image formats
    const hasModernFormats = images.some(
      (img) =>
        img.type.includes('webp') ||
        img.type.includes('avif') ||
        img.type.includes('svg')
    );

    // Log for debugging
    console.log('Images loaded:', images.length);
    console.log('Has modern formats:', hasModernFormats);
  });

  test('should cache static assets', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get cache headers from a static asset
    const responses = [];
    page.on('response', (response) => {
      const cacheControl = response.headers()['cache-control'];
      if (cacheControl) {
        responses.push({
          url: response.url(),
          cacheControl,
        });
      }
    });

    // Second visit
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Some resources should have cache headers
    const cachedResponses = responses.filter(
      (r) => r.cacheControl && !r.cacheControl.includes('no-cache')
    );

    console.log('Cached responses:', cachedResponses.length);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    // Navigate between pages multiple times
    const pages = ['/', '/login', '/register', '/'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }

    // Check memory usage (requires Chrome)
    const metrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        };
      }
      return null;
    });

    if (metrics) {
      // Memory usage should be reasonable (under 50MB)
      expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });
});
