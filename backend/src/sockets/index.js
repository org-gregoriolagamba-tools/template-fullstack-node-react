/**
 * Socket.IO Handlers
 * 
 * Initializes and configures Socket.IO event handlers.
 */

import { authenticateSocket } from "./auth.socket.js";

/**
 * Initialize Socket.IO handlers
 * @param {Server} io - Socket.IO server instance
 */
export const initializeSocketHandlers = (io) => {
  // Middleware for socket authentication (optional)
  io.use(authenticateSocket);
  
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Join user to their personal room if authenticated
    if (socket.user) {
      socket.join(`user:${socket.user._id}`);
      console.log(`👤 Authenticated user: ${socket.user.email}`);
    }
    
    // ========================
    // Event Handlers
    // ========================
    
    // Ping/Pong for connection testing
    socket.on("ping", (payload) => {
      console.log("Ping received:", payload);
      socket.emit("pong", { 
        message: "pong", 
        received: payload,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Join a room
    socket.on("join:room", (roomName) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
      socket.emit("room:joined", { room: roomName });
    });
    
    // Leave a room
    socket.on("leave:room", (roomName) => {
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room: ${roomName}`);
      socket.emit("room:left", { room: roomName });
    });
    
    // Broadcast message to a room
    socket.on("message:send", ({ room, message }) => {
      const payload = {
        from: socket.user?.email || "anonymous",
        message,
        timestamp: new Date().toISOString(),
      };
      
      if (room) {
        socket.to(room).emit("message:receive", payload);
      } else {
        socket.broadcast.emit("message:receive", payload);
      }
    });
    
    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
    });
    
    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
  
  console.log("✅ Socket.IO handlers initialized");
};

/**
 * Emit event to a specific user
 * @param {Server} io - Socket.IO server instance
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToUser = (io, userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit event to all connected clients
 * @param {Server} io - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};
