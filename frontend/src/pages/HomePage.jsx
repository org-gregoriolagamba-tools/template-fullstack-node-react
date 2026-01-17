/**
 * Home Page Component
 * 
 * Landing page for the application.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const HomePage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MyApp</h1>
          <p className="hero-subtitle">
            A modern full-stack application built with React and Node.js
          </p>
          
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>JWT-based authentication with refresh tokens for secure sessions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Updates</h3>
            <p>WebSocket integration with Socket.IO for live data synchronization.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Mobile-first design that works on all devices and screen sizes.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Modern Stack</h3>
            <p>Built with React, Redux Toolkit, Express, and MongoDB.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
