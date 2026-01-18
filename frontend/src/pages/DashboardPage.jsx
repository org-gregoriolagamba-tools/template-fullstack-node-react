/**
 * Dashboard Page Component
 * 
 * Main authenticated user dashboard.
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/userSlice';
import socketService from '../services/socketService';

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    socketService.connect(token);

    // Listen for connection status
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    const handlePong = (data) => setLastPong(data);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('pong', handlePong);

    // Check initial connection status
    setSocketConnected(socketService.isConnected());

    // Cleanup on unmount
    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('pong', handlePong);
    };
  }, []);

  const handlePing = () => {
    socketService.emit('ping', { timestamp: new Date().toISOString() });
  };

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.firstName || 'User'}!</p>
      </div>

      <div className="dashboard-grid">
        {/* User Info Card */}
        <div className="card">
          <h3>Your Profile</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Role:</strong> {user?.role || 'user'}</p>
          </div>
        </div>

        {/* Socket Status Card */}
        <div className="card">
          <h3>Real-time Connection</h3>
          <div className="socket-status">
            <p>
              <strong>Status:</strong>{' '}
              <span className={socketConnected ? 'status-online' : 'status-offline'}>
                {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </p>
            <p><strong>Socket ID:</strong> {socketService.getSocketId() || 'N/A'}</p>
            <button onClick={handlePing} className="btn btn-secondary" disabled={!socketConnected}>
              Send Ping
            </button>
            {lastPong && (
              <p className="pong-response">
                Last pong: {JSON.stringify(lastPong)}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Messages</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <p className="empty-state">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
