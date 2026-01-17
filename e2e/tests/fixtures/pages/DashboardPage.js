/**
 * Dashboard Page Object Model
 * 
 * Encapsulates dashboard page interactions.
 */

export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.welcomeMessage = page.getByRole('heading', { name: /welcome|dashboard/i });
    this.userMenu = page.getByRole('button', { name: /user menu|profile/i });
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.profileLink = page.getByRole('link', { name: /profile/i });
    this.navigation = page.getByRole('navigation');
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is on dashboard
   * @returns {Promise<boolean>}
   */
  async isOnDashboard() {
    return this.welcomeMessage.isVisible();
  }

  /**
   * Open user menu
   */
  async openUserMenu() {
    await this.userMenu.click();
  }

  /**
   * Logout user
   */
  async logout() {
    // Try direct logout button first
    const logoutVisible = await this.logoutButton.isVisible();
    if (logoutVisible) {
      await this.logoutButton.click();
    } else {
      // Open menu and click logout
      await this.openUserMenu();
      await this.logoutButton.click();
    }
  }

  /**
   * Navigate to profile page
   */
  async goToProfile() {
    await this.profileLink.click();
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }
}
