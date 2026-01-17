# Deployment Guide

This guide covers deploying the Full-Stack Node.js + React application to various environments.

## Table of Contents

- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Requirements

### System Requirements

- **Node.js**: 18.x or later (LTS recommended)
- **npm**: 9.x or later
- **MongoDB**: 6.0+ (or MongoDB Atlas)
- **Redis** (optional): For session storage and caching
- **Docker** (optional): 20.x or later for containerized deployment

### Optional Tools

- `nvm` - Node Version Manager for managing Node.js versions
- `docker-compose` - For multi-container orchestration
- `nginx` - Reverse proxy for production

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fullstack_app
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-also-32-characters-minimum
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Security
BCRYPT_SALT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_SOCKETS=true
```

---

## Local Development

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd template-fullstack-node-react

# Install all dependencies
npm run install-all

# Start MongoDB (if using local instance)
# Option 1: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6

# Option 2: Using MongoDB locally
mongod --dbpath /path/to/data

# Start development servers
npm run dev
```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

### Development with Hot Reload

Both servers support hot reloading:
- Backend uses `nodemon` to restart on file changes
- Frontend uses React's Fast Refresh

---

## Production Deployment

### Option 1: Single Server Deployment

Build and serve both frontend and backend from a single server:

```bash
# 1. Install dependencies
npm run install-all

# 2. Build frontend
npm run build

# 3. Start production server
NODE_ENV=production npm start
```

The backend will automatically serve the built frontend static files.

### Option 2: Separate Deployments

Deploy frontend and backend separately:

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Deploy build/ folder to CDN or static hosting
```

### Process Management with PM2

For production, use PM2 for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start backend/src/server.js --name "api-server" -i max

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

**PM2 Ecosystem File** (`ecosystem.config.js`):

```javascript
module.exports = {
  apps: [{
    name: 'api-server',
    script: './backend/src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
```

### Nginx Reverse Proxy

Example Nginx configuration:

```nginx
upstream api_backend {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Frontend static files
    location / {
        root /var/www/frontend/build;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Docker Deployment

### Dockerfile - Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

ENV NODE_ENV=production
EXPOSE 3001

USER node
CMD ["node", "src/server.js"]
```

### Dockerfile - Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGODB_URI=mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/app?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### Running with Docker

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Cloud Deployment

### AWS Deployment

**Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

**ECS/Fargate:**
- Use the Docker images with ECR
- Create ECS task definitions
- Deploy to Fargate for serverless containers

### Azure Deployment

**Azure App Service:**
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service plan
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux

# Create web app
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myapp --runtime "NODE|18-lts"

# Deploy
az webapp deployment source config-local-git --name myapp --resource-group myResourceGroup
```

### DigitalOcean App Platform

Create `app.yaml`:
```yaml
name: fullstack-app
services:
  - name: api
    source:
      repo: <your-repo>
      branch: main
      source_dir: /backend
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${db.DATABASE_URL}
        
databases:
  - name: db
    engine: MONGO
    production: true
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

---

## Monitoring

### Health Checks

The API provides health check endpoints:

```bash
# Basic health check
curl http://localhost:3001/api/health

# Detailed health with database status
curl http://localhost:3001/api/health/detailed
```

### Logging

Configure logging level via `LOG_LEVEL` environment variable:
- `error` - Errors only
- `warn` - Warnings and errors
- `info` - General information
- `debug` - Detailed debugging

### APM Integration

For production monitoring, consider:
- **New Relic** - Full-stack observability
- **Datadog** - Infrastructure and APM
- **Sentry** - Error tracking
- **Prometheus + Grafana** - Metrics and dashboards

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```bash
# Check MongoDB is running
mongosh --eval "db.runCommand({ping: 1})"

# Check connection string
echo $MONGODB_URI
```

**Port Already in Use:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

**WebSocket Connection Issues:**
- Ensure reverse proxy preserves WebSocket headers
- Check `Upgrade` and `Connection` headers are forwarded
- Verify CORS settings allow WebSocket origin

**Build Failures:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

**Memory Issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Security Checklist

Before deploying to production:

- [ ] Change all default secrets (JWT_SECRET, JWT_REFRESH_SECRET)
- [ ] Enable HTTPS/TLS
- [ ] Configure proper CORS origins
- [ ] Set secure cookie options
- [ ] Enable rate limiting
- [ ] Run security audit: `npm audit`
- [ ] Remove development dependencies
- [ ] Configure CSP headers
- [ ] Enable logging and monitoring
