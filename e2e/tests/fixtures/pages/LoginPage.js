/**
 * Login Page Object Model
 * 
 * Encapsulates login page interactions for reusable test code.
 */

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in|login|log in/i });
    this.errorMessage = page.getByRole('alert');
    this.registerLink = page.getByRole('link', { name: /register|sign up/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill login form
   * @param {string} email
   * @param {string} password
   */
  async fillForm(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit login form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Complete login flow
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.fillForm(email, password);
    await this.submit();
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.textContent();
  }

  /**
   * Check if error is visible
   * @returns {Promise<boolean>}
   */
  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }

  /**
   * Navigate to register page
   */
  async goToRegister() {
    await this.registerLink.click();
  }
}
