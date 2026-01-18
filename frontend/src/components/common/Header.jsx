/**
 * Header Component
 * 
 * Main navigation header with user menu.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { selectCurrentUser } from '../../store/slices/userSlice';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <h1>MyApp</h1>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              
              {/* User menu */}
              <div className="user-menu">
                <Link to="/profile" className="nav-link">
                  {user?.firstName || 'Profile'}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
