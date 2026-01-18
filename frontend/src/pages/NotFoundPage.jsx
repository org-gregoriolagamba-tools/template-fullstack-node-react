/**
 * Not Found (404) Page Component
 * 
 * Displayed when a route doesn't exist.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        
        <div className="not-found-actions">
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
