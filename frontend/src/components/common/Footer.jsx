/**
 * Footer Component
 * 
 * Application footer with links and copyright.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>MyApp</h4>
          <p>A modern full-stack application template.</p>
        </div>

        <div className="footer-section">
          <h4>Links</h4>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <nav className="footer-nav">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
