/**
 * User Service
 * 
 * Handles user profile and management API calls.
 */

import api from './api';

const userService = {
  /**
   * Update user profile
   * @param {Object} profileData - { firstName, lastName, avatar }
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  },

  /**
   * Get all users (admin only)
   * @param {Object} params - Query parameters { page, limit, sortBy, sortOrder, role, isActive, search }
   * @returns {Promise} API response
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user (admin only)
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} API response
   */
  updateUser: async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Deactivate user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  deactivateUser: async (userId) => {
    const response = await api.patch(`/users/${userId}/deactivate`);
    return response.data;
  },

  /**
   * Activate user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  activateUser: async (userId) => {
    const response = await api.patch(`/users/${userId}/activate`);
    return response.data;
  },
};

export default userService;
