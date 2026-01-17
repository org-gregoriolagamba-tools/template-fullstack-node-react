# Frontend - React Application

React frontend with Redux Toolkit, React Router, and Socket.IO.

## 🏗️ Architecture

```
src/
├── components/           # Reusable components
│   ├── auth/             # Authentication components
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   └── common/           # Common UI components
│       ├── Button.jsx
│       ├── Footer.jsx
│       ├── Header.jsx
│       ├── Input.jsx
│       ├── LoadingSpinner.jsx
│       └── Notifications.jsx
├── layouts/              # Layout components
│   ├── AuthLayout.jsx
│   └── MainLayout.jsx
├── pages/                # Page components
│   ├── DashboardPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── ProfilePage.jsx
│   └── RegisterPage.jsx
├── services/             # API services
│   ├── api.js            # Axios configuration
│   ├── authService.js
│   ├── socketService.js
│   └── userService.js
├── store/                # Redux store
│   ├── index.js          # Store configuration
│   └── slices/           # Redux slices
│       ├── authSlice.js
│       ├── uiSlice.js
│       └── userSlice.js
├── styles/               # CSS files
│   └── index.css
├── __tests__/            # Test files
├── App.jsx               # Main app component
├── index.jsx             # Entry point
└── setupTests.js         # Test setup
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## 📝 Environment Variables

Create a `.env` file (optional):

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | (uses proxy) |
| `REACT_APP_SOCKET_URL` | WebSocket URL | localhost:3001 |

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 State Management

### Auth Slice
Manages authentication state:
- `isAuthenticated` - User login status
- `accessToken` / `refreshToken` - JWT tokens
- `isLoading` - Loading state
- `error` - Error messages

### User Slice
Manages user data:
- `currentUser` - Current user profile

### UI Slice
Manages UI state:
- `notifications` - Toast notifications
- `isGlobalLoading` - Global loading state
- `theme` - Light/dark theme
- `modal` - Modal state

## 🔐 Protected Routes

```jsx
// Requires authentication
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>

// Admin only
<Route element={<ProtectedRoute requiredRoles={['admin']} />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>

// Redirects if authenticated
<Route element={<PublicRoute />}>
  <Route path="/login" element={<LoginPage />} />
</Route>
```