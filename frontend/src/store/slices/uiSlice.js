/**
 * UI Slice
 * 
 * Manages global UI state like notifications, modals, and loading indicators.
 */

import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Notifications/Toasts
  notifications: [],
  
  // Global loading state
  isGlobalLoading: false,
  
  // Sidebar state
  isSidebarOpen: true,
  
  // Theme
  theme: localStorage.getItem('theme') || 'light',
  
  // Modal state
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

// Generate unique ID for notifications
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: generateId(),
        type: action.payload.type || 'info', // 'success', 'error', 'warning', 'info'
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Global loading
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
    
    // Modal
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  setGlobalLoading,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectIsGlobalLoading = (state) => state.ui.isGlobalLoading;
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectModal = (state) => state.ui.modal;

// Helper action creator for notifications
export const showNotification = (message, type = 'info', duration = 5000) => 
  addNotification({ message, type, duration });

export const showSuccess = (message) => showNotification(message, 'success');
export const showError = (message) => showNotification(message, 'error');
export const showWarning = (message) => showNotification(message, 'warning');
export const showInfo = (message) => showNotification(message, 'info');
