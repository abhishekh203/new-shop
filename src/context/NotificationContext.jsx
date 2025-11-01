import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationContainer } from '../design-system/components/SerifNotification';

const NotificationContext = createContext(null);

/**
 * Notification Provider - Manages all notifications globally
 */
export const NotificationProvider = ({ children, position = 'bottom-right' }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(({ type = 'success', message, title, icon, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      message,
      title,
      icon,
      duration,
    };

    setNotifications((prev) => [...prev, notification]);

    return id;
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return showNotification({ type: 'success', message, ...options });
  }, [showNotification]);

  const error = useCallback((message, options = {}) => {
    return showNotification({ type: 'error', message, ...options });
  }, [showNotification]);

  const info = useCallback((message, options = {}) => {
    return showNotification({ type: 'info', message, ...options });
  }, [showNotification]);

  const warning = useCallback((message, options = {}) => {
    return showNotification({ type: 'warning', message, ...options });
  }, [showNotification]);

  const value = {
    showNotification,
    closeNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={closeNotification}
        position={position}
      />
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use notifications
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

