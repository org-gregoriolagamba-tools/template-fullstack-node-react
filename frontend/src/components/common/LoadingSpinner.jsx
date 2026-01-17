/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator.
 */

import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = '' }) => {
  const sizeClass = `spinner-${size}`;
  
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={`spinner ${sizeClass}`}>
            <div className="spinner-circle"></div>
          </div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
