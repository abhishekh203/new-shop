import React, { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowNotification(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showNotification) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
                isOnline 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
            }`}>
                {isOnline ? (
                    <>
                        <FaWifi className="text-lg" />
                        <span className="text-sm font-medium">Connection restored</span>
                    </>
                ) : (
                    <>
                        <FaExclamationTriangle className="text-lg" />
                        <span className="text-sm font-medium">No internet connection</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default NetworkStatus; 