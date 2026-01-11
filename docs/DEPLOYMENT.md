# Deployment Guide

## Requirements
- Node.js 18.x or later (LTS recommended)
- npm 8.x or later (bundled with Node) or Yarn
- Optional: `nvm` to manage Node versions

## Overview
This repository contains two services:
- `backend` — Node/Express + Socket.IO server
- `frontend` — Create React App (CRA) based React application

Deployment approaches:
- Simple (same server): build frontend and serve `frontend/build` from the backend.
- Containerized: build Docker images for frontend and backend and run via Docker Compose or Kubernetes.

## Recommended production deployment (single host)
1. Ensure system has Node.js >= 18 and `npm` installed.
2. From the repo root, install dependencies for both projects:

```bash
npm run install-deps
```

3. Build the frontend for production:

```bash
cd frontend
npm run build
```

4. Start the backend which will serve the `frontend/build` files automatically if present:

```bash
cd ../backend
npm start
```

5. (Optional) Front backend with a reverse proxy (recommended):

- Configure Nginx to proxy `/api` and WebSocket routes to the backend process and serve static files from the backend server or directly from `frontend/build`.

## Containerized deployment (recommended for repeatable deploys)
1. Create Dockerfiles for both `frontend` and `backend`.
2. Use a `docker-compose.yml` to build and run both services locally or in production.

## Security notes
- The CRA dev server is for development only — do not expose it to the public internet.
- Keep Node updated and apply security patches; run `npm audit` regularly.
- For production, serve static assets from a CDN or a hardened web server (Nginx) and terminate TLS at the proxy.

## Troubleshooting
- If frontend fails to build, ensure your Node version matches `engines` in `frontend/package.json` (use nvm to change versions).
- If sockets fail to connect, confirm backend is reachable and proxy preserves WebSocket connections.
