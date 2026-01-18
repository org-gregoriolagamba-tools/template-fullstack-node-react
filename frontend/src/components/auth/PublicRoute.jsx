/**
 * Public Route Component
 * 
 * Wrapper for routes that should only be accessible when NOT authenticated.
 * Redirects authenticated users to dashboard.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const PublicRoute = ({ redirectTo = '/dashboard' }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // Show loading while checking auth status
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Redirect to dashboard (or specified route) if already authenticated
  if (isAuthenticated) {
    // Check if there's a "from" location to redirect back to
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default PublicRoute;
