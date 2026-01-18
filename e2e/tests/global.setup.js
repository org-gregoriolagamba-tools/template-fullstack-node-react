/**
 * Global Setup
 * 
 * Runs once before all tests. Use for:
 * - Creating test users
 * - Setting up test data
 * - Authenticating and storing session
 */

import { chromium } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables
config();

async function globalSetup() {
  console.log('🚀 Running global setup...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
    const apiURL = process.env.E2E_API_URL || 'http://localhost:3001';

    // Check if API is healthy
    const response = await page.request.get(`${apiURL}/api/health`);
    if (!response.ok()) {
      throw new Error('API health check failed');
    }
    console.log('✅ API is healthy');

    // Navigate to app to verify frontend is ready
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    console.log('✅ Frontend is ready');

    // Create test user if needed (optional)
    // This would typically involve:
    // 1. Calling API to create user
    // 2. Storing authentication state for reuse

    console.log('✅ Global setup completed');
  } catch (error) {
    console.error('❌ Global setup failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
