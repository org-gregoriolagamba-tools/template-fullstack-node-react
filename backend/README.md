# Backend - Express.js API

Node.js/Express backend with MongoDB, JWT authentication, and Socket.IO.

## 🏗️ Architecture

```
src/
├── config/           # Configuration files
│   ├── index.js      # Environment variables
│   └── database.js   # MongoDB connection
├── controllers/      # Request handlers
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware/       # Express middleware
│   ├── auth.middleware.js      # JWT authentication
│   ├── errorHandler.js         # Error handling
│   ├── rateLimiter.middleware.js
│   ├── requestLogger.js
│   └── validation.middleware.js
├── models/           # Mongoose schemas
│   └── User.model.js
├── routes/           # API routes
│   ├── auth.routes.js
│   ├── health.routes.js
│   ├── user.routes.js
│   └── index.js
├── sockets/          # Socket.IO handlers
│   ├── auth.socket.js
│   └── index.js
├── utils/            # Utility functions
│   ├── AppError.js
│   ├── asyncHandler.js
│   ├── jwt.utils.js
│   └── response.utils.js
├── validations/      # Joi schemas
│   ├── auth.validation.js
│   └── user.validation.js
└── server.js         # Entry point
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 3001 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/fullstack_app |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `JWT_REFRESH_SECRET` | Refresh token key | - |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 30d |
| `CORS_ORIGIN` | Allowed origins | http://localhost:3000 |

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |
| `npm test` | Run tests with coverage |
| `npm run lint` | Run ESLint |

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 📚 API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```