/**
 * Application Entry Point
 * 
 * Initializes React with Redux store and React Router.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import './styles/index.css';

// Get root container
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in public/index.html');
}

// Create root and render app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
