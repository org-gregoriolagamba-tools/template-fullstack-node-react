/**
 * API Client Configuration
 * 
 * Configures Axios with interceptors for authentication and error handling.
 */

import axios from 'axios';
import { store } from '../store';
import { setTokens, logout } from '../store/slices/authSlice';
import { showError } from '../store/slices/uiSlice';

// API base URL from environment or default
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      // Show error notification for non-401 errors
      if (error.response?.status !== 401) {
        const message = error.response?.data?.message || 'An error occurred';
        store.dispatch(showError(message));
      }
      return Promise.reject(error);
    }
    
    // Handle 401 - try to refresh token
    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;
    
    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });
      
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // Update tokens in store and localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));
      
      // Process queued requests
      processQueue(null, accessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
