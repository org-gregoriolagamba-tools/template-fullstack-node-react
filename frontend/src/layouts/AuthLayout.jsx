/**
 * Auth Layout Component
 * 
 * Layout for authentication pages (login, register).
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Notifications from '../components/common/Notifications';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Notifications */}
      <Notifications />
      
      <div className="auth-container">
        {/* Logo/Brand */}
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <h1>MyApp</h1>
          </Link>
        </div>
        
        {/* Auth content (login/register forms) */}
        <div className="auth-content">
          <Outlet />
        </div>
        
        {/* Footer links */}
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
