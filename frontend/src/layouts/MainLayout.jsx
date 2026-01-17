/**
 * Main Layout Component
 * 
 * Primary layout with header, navigation, and footer.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Notifications from '../components/common/Notifications';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { selectIsGlobalLoading } from '../store/slices/uiSlice';

const MainLayout = () => {
  const isLoading = useSelector(selectIsGlobalLoading);

  return (
    <div className="app-layout">
      {/* Global loading overlay */}
      {isLoading && <LoadingSpinner fullScreen />}
      
      {/* Notifications */}
      <Notifications />
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
