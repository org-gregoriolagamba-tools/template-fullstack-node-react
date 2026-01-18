/**
 * Protected Route Component
 * 
 * Wrapper for routes that require authentication.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector((state) => state.user.currentUser);

  // Show loading while checking auth status
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if required
  if (requiredRoles.length > 0 && user) {
    if (!requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
