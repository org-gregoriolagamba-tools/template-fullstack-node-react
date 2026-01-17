# E2E Testing with Playwright

Comprehensive end-to-end testing suite using [Playwright](https://playwright.dev/).

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Object Model](#page-object-model)
- [Test Fixtures](#test-fixtures)
- [Configuration](#configuration)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

This test suite provides:

- **UI Tests**: End-to-end user flow testing
- **API Tests**: Direct API endpoint testing
- **Authentication Tests**: Login, registration, logout flows
- **Accessibility Tests**: Basic a11y compliance checks
- **Performance Tests**: Page load and performance metrics

### Technology Stack

- **Playwright**: Modern cross-browser testing framework
- **Faker.js**: Generate realistic test data
- **Page Object Model**: Maintainable test architecture

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Navigate to e2e directory
cd e2e

# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your test configuration
```

Required environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `E2E_BASE_URL` | Frontend URL | `http://localhost:3000` |
| `E2E_API_URL` | Backend API URL | `http://localhost:3001` |
| `E2E_TEST_USER_EMAIL` | Test user email | `test@example.com` |
| `E2E_TEST_USER_PASSWORD` | Test user password | `TestPassword123!` |
| `E2E_ADMIN_EMAIL` | Admin user email | `admin@example.com` |
| `E2E_ADMIN_PASSWORD` | Admin user password | `AdminPassword123!` |

---

## Project Structure

```
e2e/
├── playwright.config.js      # Playwright configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment template
├── .auth/                    # Stored authentication state
│   └── user.json
├── reports/                  # Test reports
│   ├── html/
│   └── results.json
├── test-results/             # Test artifacts (screenshots, videos)
└── tests/
    ├── global.setup.js       # Global setup (runs once)
    ├── auth.setup.js         # Authentication setup
    ├── fixtures/
    │   ├── test-fixtures.js  # Custom fixtures
    │   └── pages/            # Page Object Models
    │       ├── index.js
    │       ├── LoginPage.js
    │       ├── RegisterPage.js
    │       └── DashboardPage.js
    ├── auth/                 # Authentication tests
    │   ├── login.spec.js
    │   ├── register.spec.js
    │   └── logout.spec.js
    ├── ui/                   # UI/UX tests
    │   ├── homepage.spec.js
    │   └── dashboard.spec.js
    ├── api/                  # API tests
    │   ├── health.spec.js
    │   ├── auth.spec.js
    │   └── users.spec.js
    ├── a11y/                 # Accessibility tests
    │   └── accessibility.spec.js
    └── performance/          # Performance tests
        └── performance.spec.js
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Debug tests
npm run test:debug
```

### Browser-Specific Tests

```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit (Safari) only
npm run test:webkit

# Mobile browsers
npm run test:mobile
```

### Filtered Tests

```bash
# Run smoke tests
npm run test:smoke

# Run critical path tests
npm run test:critical

# Run authentication tests
npm run test:auth

# Run API tests
npm run test:api
```

### Generate Test Code

```bash
# Open Playwright codegen
npm run codegen
```

### View Reports

```bash
# Open HTML report
npm run report
```

---

## Writing Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something @smoke', async ({ page }) => {
    // Test steps
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

### Using Page Objects

```javascript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/pages/index.js';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  await expect(page).toHaveURL(/dashboard/);
});
```

### Using Custom Fixtures

```javascript
import { test, expect } from '../fixtures/test-fixtures.js';

test('should create user with random data', async ({ page, testUser }) => {
  // testUser contains generated fake user data
  console.log(testUser.email);
});

test('should call API directly', async ({ apiContext }) => {
  const response = await apiContext.get('/api/health');
  expect(response.ok()).toBe(true);
});
```

### Authenticated Tests

```javascript
import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  // Use stored authentication state
  test.use({ storageState: '.auth/user.json' });

  test('should access dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

---

## Page Object Model

Page Objects encapsulate page interactions for maintainable tests.

### Creating a Page Object

```javascript
// tests/fixtures/pages/MyPage.js
export class MyPage {
  constructor(page) {
    this.page = page;
    
    // Define locators
    this.heading = page.getByRole('heading', { name: /my page/i });
    this.submitButton = page.getByRole('button', { name: /submit/i });
  }

  async goto() {
    await this.page.goto('/my-page');
  }

  async submit() {
    await this.submitButton.click();
  }
}
```

### Using Page Objects

```javascript
import { MyPage } from '../fixtures/pages/MyPage.js';

test('should use page object', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto();
  await myPage.submit();
});
```

---

## Test Fixtures

### Available Fixtures

| Fixture | Description |
|---------|-------------|
| `page` | Default Playwright page |
| `authenticatedPage` | Page with stored authentication |
| `testUser` | Generated fake user data |
| `apiContext` | API request context |
| `authenticatedApiContext` | API context with auth token |

### Creating Custom Fixtures

```javascript
import { test as base } from '@playwright/test';

export const test = base.extend({
  myFixture: async ({}, use) => {
    // Setup
    const data = await setupSomething();
    
    // Provide to test
    await use(data);
    
    // Cleanup
    await cleanupSomething();
  },
});
```

---

## Configuration

### playwright.config.js

Key configuration options:

```javascript
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Parallel execution
  fullyParallel: true,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  // Global settings
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Browser projects
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],

  // Start servers before tests
  webServer: [
    { command: 'npm run start:backend', url: 'http://localhost:3001/api/health' },
    { command: 'npm run start:frontend', url: 'http://localhost:3000' },
  ],
});
```

### Test Tags

Use tags to categorize tests:

```javascript
test('important test @smoke @critical', async ({ page }) => {
  // This test has smoke and critical tags
});
```

Run tagged tests:

```bash
# Run smoke tests
npx playwright test --grep @smoke

# Run all except slow tests
npx playwright test --grep-invert @slow
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm run install-all
          cd e2e && npm install
      
      - name: Install Playwright Browsers
        run: cd e2e && npx playwright install --with-deps
      
      - name: Start application
        run: npm run dev &
        env:
          CI: true
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000 http://localhost:3001/api/health
      
      - name: Run E2E tests
        run: cd e2e && npm test
        env:
          CI: true
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: e2e/reports/html/
          retention-days: 30
```

### Environment Variables in CI

```yaml
env:
  E2E_BASE_URL: http://localhost:3000
  E2E_API_URL: http://localhost:3001
  E2E_TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  E2E_TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

---

## Best Practices

### 1. Use Locators Effectively

```javascript
// ✅ Good - Semantic locators
page.getByRole('button', { name: /submit/i })
page.getByLabel('Email')
page.getByTestId('login-form')

// ❌ Avoid - Fragile selectors
page.locator('.btn-primary')
page.locator('#submit-btn')
page.locator('div > form > button:nth-child(2)')
```

### 2. Wait for Elements

```javascript
// ✅ Good - Auto-waiting assertions
await expect(page.getByText('Success')).toBeVisible();

// ❌ Avoid - Manual timeouts
await page.waitForTimeout(1000);
```

### 3. Isolate Tests

```javascript
// ✅ Good - Independent tests
test('should create user', async ({ testUser }) => {
  // Uses unique generated user
});

// ❌ Avoid - Dependent tests
test('step 1', async () => { /* creates user */ });
test('step 2', async () => { /* depends on step 1 */ });
```

### 4. Use Descriptive Names

```javascript
// ✅ Good
test('should display error when logging in with invalid password', async () => {});

// ❌ Avoid
test('login test 1', async () => {});
```

### 5. Keep Tests Fast

```javascript
// ✅ Good - API for setup
test.beforeEach(async ({ apiContext }) => {
  await apiContext.post('/api/test/reset');
});

// ❌ Avoid - UI for setup
test.beforeEach(async ({ page }) => {
  await page.goto('/admin');
  await page.click('Reset Database');
});
```

---

## Troubleshooting

### Common Issues

#### Tests timing out

```javascript
// Increase timeout for slow operations
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // ...
});
```

#### Element not found

```javascript
// Wait for network idle
await page.waitForLoadState('networkidle');

// Or wait for specific element
await page.getByRole('button').waitFor({ state: 'visible' });
```

#### Authentication issues

```bash
# Regenerate auth state
rm -rf .auth/
npx playwright test --project=setup
```

#### Browser not installed

```bash
npx playwright install --with-deps
```

### Debug Mode

```bash
# Run with debug
PWDEBUG=1 npx playwright test

# Or use VS Code extension
# Install: Playwright Test for VSCode
```

### Trace Viewer

```bash
# View trace from failed test
npx playwright show-trace test-results/trace.zip
```

---

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
