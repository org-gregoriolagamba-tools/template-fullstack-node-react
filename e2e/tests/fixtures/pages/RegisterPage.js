/**
 * Register Page Object Model
 * 
 * Encapsulates registration page interactions.
 */

export class RegisterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.submitButton = page.getByRole('button', { name: /sign up|register|create account/i });
    this.errorMessage = page.getByRole('alert');
    this.loginLink = page.getByRole('link', { name: /sign in|login|log in/i });
  }

  /**
   * Navigate to register page
   */
  async goto() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill registration form
   * @param {Object} userData
   * @param {string} userData.firstName
   * @param {string} userData.lastName
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} [userData.confirmPassword]
   */
  async fillForm({ firstName, lastName, email, password, confirmPassword }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword || password);
  }

  /**
   * Submit registration form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Complete registration flow
   * @param {Object} userData
   */
  async register(userData) {
    await this.fillForm(userData);
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
   * Navigate to login page
   */
  async goToLogin() {
    await this.loginLink.click();
  }
}
