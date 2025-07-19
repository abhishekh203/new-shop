// Firebase authentication error handler
export const handleAuthError = (error) => {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/invalid-email': 'Invalid email format',
        'auth/email-already-in-use': 'Email already registered',
        'auth/weak-password': 'Password is too weak',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'auth/popup-closed-by-user': 'Login cancelled',
        'auth/cancelled-popup-request': 'Login cancelled',
        'auth/popup-blocked': 'Popup blocked. Please allow popups for this site'
    };
    
    return errorMessages[error.code] || 'An error occurred. Please try again.';
};

// Error severity levels for UI feedback
export const getErrorSeverity = (errorCode) => {
    const severityMap = {
        'auth/user-not-found': 'warning',
        'auth/wrong-password': 'warning',
        'auth/too-many-requests': 'error',
        'auth/invalid-credential': 'warning',
        'auth/invalid-email': 'warning',
        'auth/email-already-in-use': 'warning',
        'auth/weak-password': 'warning',
        'auth/network-request-failed': 'error',
        'auth/popup-closed-by-user': 'info',
        'auth/cancelled-popup-request': 'info',
        'auth/popup-blocked': 'warning'
    };
    
    return severityMap[errorCode] || 'error';
}; 