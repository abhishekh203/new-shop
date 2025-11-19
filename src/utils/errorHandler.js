// Supabase authentication error handler
export const handleAuthError = (error) => {
    // Handle Supabase error messages and codes
    const errorMessages = {
        // Supabase Auth error codes
        'invalid_credentials': 'Invalid email or password',
        'email_not_confirmed': 'Please verify your email before logging in',
        'signup_disabled': 'Account registration is currently disabled',
        'email_address_invalid': 'Invalid email format',
        'password_too_short': 'Password must be at least 6 characters',
        'weak_password': 'Password is too weak. Use a stronger password',
        'email_address_not_authorized': 'This email is not authorized to sign up',
        'user_not_found': 'No account found with this email',
        'too_many_requests': 'Too many attempts. Please try again later',
        'network_error': 'Network error. Please check your connection',
        'session_not_found': 'Session expired. Please log in again',
        'refresh_token_not_found': 'Session expired. Please log in again',
        
        // Legacy Firebase codes (for backward compatibility during transition)
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/invalid-email': 'Invalid email format',
        'auth/email-already-in-use': 'Email already registered',
        'auth/weak-password': 'Password is too weak',
        'auth/network-request-failed': 'Network error. Please check your connection'
    };
    
    // Check for error message or code
    const errorKey = error?.message?.toLowerCase() || error?.code || error?.error_description || '';
    
    // Try to match error message patterns
    if (errorKey.includes('invalid_credentials') || errorKey.includes('invalid login credentials')) {
        return 'Invalid email or password';
    }
    if (errorKey.includes('email not confirmed') || errorKey.includes('email_not_confirmed')) {
        return 'Please verify your email before logging in';
    }
    if (errorKey.includes('weak_password') || errorKey.includes('password is too weak')) {
        return 'Password is too weak. Use a stronger password';
    }
    if (errorKey.includes('email_address_invalid') || errorKey.includes('invalid email')) {
        return 'Invalid email format';
    }
    if (errorKey.includes('user_not_found') || errorKey.includes('user not found')) {
        return 'No account found with this email';
    }
    if (errorKey.includes('too_many_requests') || errorKey.includes('rate limit')) {
        return 'Too many attempts. Please try again later';
    }
    
    // Fallback to direct code lookup
    return errorMessages[error?.code] || errorMessages[errorKey] || error?.message || 'An error occurred. Please try again.';
};

// Error severity levels for UI feedback
export const getErrorSeverity = (errorCode) => {
    const severityMap = {
        // Supabase error severities
        'invalid_credentials': 'warning',
        'email_not_confirmed': 'info',
        'signup_disabled': 'error',
        'email_address_invalid': 'warning',
        'password_too_short': 'warning',
        'weak_password': 'warning',
        'email_address_not_authorized': 'error',
        'user_not_found': 'warning',
        'too_many_requests': 'error',
        'network_error': 'error',
        'session_not_found': 'warning',
        'refresh_token_not_found': 'warning',
        
        // Legacy Firebase codes
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