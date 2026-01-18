# Full-Stack Template: React + Node.js

A production-ready full-stack template with React frontend and Node.js/Express backend, featuring JWT authentication, MongoDB integration, Redux state management, and real-time WebSocket communication.

## 🚀 Features

### Backend
- **Express.js** server with modular architecture
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with access/refresh tokens
- **Role-based Access Control** (RBAC)
- **Request Validation** using Joi
- **Rate Limiting** for API protection
- **Error Handling** with centralized error middleware
- **Socket.IO** for real-time communication
- **Security** with Helmet, CORS, and bcrypt

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Protected Routes** with authentication guards
- **Axios** with interceptors for API calls
- **Socket.IO Client** for WebSocket connections
- **Responsive CSS** with custom properties

## 📁 Project Structure

```
template-fullstack-node-react/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── sockets/         # Socket.IO handlers
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Joi schemas
│   │   └── server.js        # Entry point
│   ├── __tests__/           # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Auth-related components
│   │   │   └── common/      # Common UI components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   │   └── slices/      # Redux slices
│   │   ├── styles/          # CSS files
│   │   ├── __tests__/       # Frontend tests
│   │   └── index.jsx        # Entry point
│   └── package.json
├── docs/                    # Documentation
├── .editorconfig           # Editor configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
└── package.json            # Root package.json
```

## 🛠️ Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** (local or Atlas)

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd template-fullstack-node-react
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

**Backend** (create `backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/fullstack_app
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-characters
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (optional, create `frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

## 🚀 Running the Application

### Development Mode (Both servers)

```bash
npm run dev
```

This starts:
- Backend at `http://localhost:3001`
- Frontend at `http://localhost:3000`

### Backend Only

```bash
npm run dev:backend
```

### Frontend Only

```bash
npm run dev:frontend
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Backend Tests

```bash
npm run test:backend
```

### Frontend Tests

```bash
npm run test:frontend
```

### E2E Tests with Playwright

```bash
# Install Playwright browsers (first time only)
npm run e2e:install

# Run all E2E tests
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Run with Playwright UI
npm run test:e2e:ui

# Run smoke tests only
npm run test:e2e:smoke

# Open test report
npm run test:e2e:report

# Generate test code
npm run e2e:codegen
```

See [E2E Testing Documentation](e2e/README.md) for more details.

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:backend` | Start backend with nodemon |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm start` | Start backend in production mode |
| `npm run install:all` | Install dependencies for all packages |
| `npm test` | Run all unit tests |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run lint` | Run ESLint on all packages |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove all node_modules |

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PATCH | `/api/auth/update-password` | Update password | Yes |

### Users (Admin only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PATCH | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PATCH | `/api/users/profile` | Update own profile | Yes |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Basic health check |
| GET | `/api/health/detailed` | Detailed health info |
| GET | `/api/health/ready` | Readiness probe (K8s) |
| GET | `/api/health/live` | Liveness probe (K8s) |

## 🌐 WebSocket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `ping` | `{ timestamp }` | Test connection |
| `join:room` | `roomName` | Join a room |
| `leave:room` | `roomName` | Leave a room |
| `message:send` | `{ room, message }` | Send message |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `pong` | `{ message, received, timestamp }` | Ping response |
| `room:joined` | `{ room }` | Room join confirmation |
| `room:left` | `{ room }` | Room leave confirmation |
| `message:receive` | `{ from, message, timestamp }` | Received message |

## 🏗️ Architecture

This template follows a modern full-stack architecture with clear separation of concerns. For a complete architectural overview including detailed diagrams, technology stack explanations, security architecture, and design patterns, see the [Architecture Documentation](docs/ARCHITECTURE.md).

### Quick Overview

**Backend Architecture:**
```
Request → Middleware → Controller → Service → Model → Database
                ↓
            Validation
                ↓
           Rate Limiting
                ↓
          Authentication
```

**State Management (Redux):**
```
Component → Dispatch Action → Thunk → API Call → Reducer → Store Update → Re-render
```

### Key Technologies

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.IO
- **Frontend**: React 18, Redux Toolkit, React Router, Axios, Socket.IO Client
- **Testing**: Jest, React Testing Library, Playwright
- **Security**: Helmet, bcrypt, CORS, Rate Limiting

For detailed information about each technology, design patterns, data flow, and deployment architecture, please refer to the [complete architecture documentation](docs/ARCHITECTURE.md).

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - Complete architectural overview with diagrams
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions and best practices
- [E2E Testing Guide](e2e/README.md) - End-to-end testing with Playwright
