/**
 * WebSocket Service
 * 
 * Manages Socket.IO connection for real-time features.
 */

import { io } from 'socket.io-client';
import { store } from '../store';

// Socket.IO server URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 
  `${window.location.protocol}//${window.location.hostname}:3001`;

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Connect to Socket.IO server
   * @param {string} token - Optional auth token
   */
  connect(token = null) {
    if (this.socket?.connected) {
      return;
    }

    const options = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    };

    // Add auth token if provided
    if (token) {
      options.auth = { token };
    }

    this.socket = io(SOCKET_URL, options);

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Track listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from tracked listeners
      if (this.listeners.has(event)) {
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  /**
   * Join a room
   * @param {string} room - Room name
   */
  joinRoom(room) {
    this.emit('join:room', room);
  }

  /**
   * Leave a room
   * @param {string} room - Room name
   */
  leaveRoom(room) {
    this.emit('leave:room', room);
  }

  /**
   * Send a message
   * @param {string} message - Message content
   * @param {string} room - Optional room to send to
   */
  sendMessage(message, room = null) {
    this.emit('message:send', { room, message });
  }

  /**
   * Check if connected
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   * @returns {string|null}
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
