/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 */

import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, confirmPassword, firstName, lastName }
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} API response
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  /**
   * Update password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmNewPassword }
   * @returns {Promise} API response
   */
  updatePassword: async (passwordData) => {
    const response = await api.patch('/auth/update-password', passwordData);
    return response.data;
  },
};

export default authService;
