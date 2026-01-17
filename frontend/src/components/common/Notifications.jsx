/**
 * Notifications Component
 * 
 * Displays toast notifications from the UI state.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotifications, removeNotification } from '../../store/slices/uiSlice';

const Notification = ({ notification, onDismiss }) => {
  const { id, type, message, duration } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const typeClass = `notification-${type}`;

  return (
    <div className={`notification ${typeClass}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>
        <p className="notification-message">{message}</p>
      </div>
      <button
        className="notification-close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const handleDismiss = (id) => {
    dispatch(removeNotification(id));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default Notifications;
