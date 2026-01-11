import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import fs from "fs";
import { Server as SocketIO } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create a Socket.IO server instance bound to the HTTP server.
// We import `Server` from `socket.io` and instantiate it here.
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Basic middleware
app.use(cors());
app.use(express.json());

// Static asset serving: prefer a production React build if present
// (frontend/build). If not present, fall back to a `public` folder
// inside the backend (useful for small demos).
const frontendBuildPath = path.join(process.cwd(), "frontend", "build");
const backendPublicPath = path.join(process.cwd(), "backend", "public");

if (fs.existsSync(frontendBuildPath)) {
  // Serve the React production build
  app.use(express.static(frontendBuildPath));
  // Serve index.html for SPA routing
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else if (fs.existsSync(backendPublicPath)) {
  // Fallback: serve backend/public if it exists
  app.use(express.static(backendPublicPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(backendPublicPath, "index.html"));
  });
} else {
  // No static assets found — keep a simple health route instead
  app.get("/", (req, res) => {
    res.send("Backend running. Build frontend separately during development.");
  });
}

// ------------------------
// Data Structures
// ------------------------
// Define application state or connect to a database here.

// ------------------------
// Middleware functions
// ------------------------
// Add any custom middleware (authentication, logging, etc.) here.

// ------------------------
// API Routes
// ------------------------
// Health Check Endpoint: useful for load balancers and quick checks.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ------------------------
// Socket.IO handlers
// ------------------------
// Keep socket handlers small and emit events for other layers to handle.
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Example: handle a custom event from clients
  socket.on("ping", (payload) => {
    console.log("ping received", payload);
    socket.emit("pong", { message: "pong", received: payload });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});