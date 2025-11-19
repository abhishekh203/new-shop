import { useState, useCallback } from 'react';
import { supabase } from '../../supabase/supabaseConfig';
import { handleAuthError } from '../../utils/errorHandler';
import { RateLimiter } from '../../utils/validation';
import { SecureSession } from '../../utils/security';
import { safeSetJSON } from '../../utils/dataNormalization';
import toast from 'react-hot-toast';
import logger from '../../utils/logger';

// Initialize rate limiter
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts, 15 min lockout

const getAuthErrorMessage = (error) => {
    if (!error) {
        return 'An error occurred. Please try again.';
    }

    if (error.code && String(error.code).startsWith('auth/')) {
        return handleAuthError(error);
    }

    return error.message || handleAuthError(error);
};

const buildUserProfile = (supabaseUser, overrides = {}) => ({
    id: supabaseUser.id,
    name: overrides.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email,
    role: overrides.role || supabaseUser.user_metadata?.role || 'user',
    email_verified: Boolean(supabaseUser.email_confirmed_at),
    created_at: overrides.created_at || new Date().toISOString(),
    updated_at: overrides.updated_at || new Date().toISOString()
});

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Login function with rate limiting
    const login = useCallback(async (email, password) => {
        if (!rateLimiter.isAllowed(email)) {
            const remainingTime = rateLimiter.getLockoutTimeRemaining(email);
            const minutes = Math.ceil(remainingTime / 60000);
            toast.error(`Too many login attempts. Try again in ${minutes} minutes.`);
            return { success: false, error: 'rate_limited' };
        }

        setLoading(true);
        setProgress(25);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            const user = data?.user;

            if (!user) {
                throw new Error('Supabase authentication succeeded but no user data was returned.');
            }

            setProgress(50);

            let userData = null;
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
            }

            if (profile) {
                userData = profile;
            } else {
                const newProfile = buildUserProfile(user);
                const { data: insertedProfile, error: insertError } = await supabase
                    .from('users')
                    .insert(newProfile)
                    .select()
                    .single();

                if (insertError) {
                    throw insertError;
                }

                userData = insertedProfile;
            }

            setProgress(75);

            // Use secure session storage with 24-hour expiration
            SecureSession.setSecureItem('users', userData, 24 * 60);
            // Fallback to regular localStorage for compatibility
            safeSetJSON('users', userData);

            rateLimiter.resetAttempts(email);

            setProgress(100);
            toast.success('Login successful! Redirecting...');

            return {
                success: true,
                user: userData,
                redirectTo: '/'
            };
        } catch (error) {
            logger.error('Login error', { error: error.message, email });
            rateLimiter.recordAttempt(email);

            const errorMessage = getAuthErrorMessage(error);
            toast.error(errorMessage);

            return {
                success: false,
                error: error?.code || 'auth_error',
                message: errorMessage
            };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Signup function
    const signup = useCallback(async (userData) => {
        setLoading(true);
        setProgress(25);

        try {
            // Directly attempt signup with Supabase Auth
            // Let Supabase handle duplicate email checking
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name.trim(),
                        role: userData.role || 'user'
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                throw error;
            }

            const supabaseUser = data?.user;
            setProgress(50);

            // Only create profile if we have a user and session
            if (supabaseUser && data?.session) {
                const profile = buildUserProfile(supabaseUser, {
                    name: userData.name.trim(),
                    role: userData.role || 'user'
                });

                const { error: profileError } = await supabase
                    .from('users')
                    .upsert(profile);

                if (profileError) {
                    logger.error('Profile creation error', { error: profileError.message });
                    // Don't throw here - the auth user was created successfully
                    // The profile will be created on first login via trigger
                }
            }

            setProgress(100);

            if (!data?.session) {
                // User needs to verify their email
                toast.success('Account created! Please check your email and click the verification link before logging in.');
                return { 
                    success: true, 
                    requiresVerification: true,
                    message: 'Please check your email and click the verification link to complete your registration.'
                };
            }

            // User is immediately logged in (email confirmation disabled)
            toast.success('Account created successfully! Redirecting...');
            return { success: true };
        } catch (error) {
            logger.error('Signup error', { error: error.message });
            const errorMessage = getAuthErrorMessage(error);
            toast.error(errorMessage);

            return {
                success: false,
                error: error?.code || 'auth_error',
                message: errorMessage
            };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Password reset function
    const resetPassword = useCallback(async (email) => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) {
                throw error;
            }

            toast.success('Password reset email sent! Check your inbox (and spam folder).');
            return { success: true };
        } catch (error) {
            logger.error('Password reset error', { error: error.message });
            const errorMessage = getAuthErrorMessage(error);
            toast.error(errorMessage);
            return {
                success: false,
                error: error?.code || 'auth_error',
                message: errorMessage
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // Google signup/login function
    const signupWithGoogle = useCallback(async () => {
        setLoading(true);
        setProgress(25);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            });

            if (error) {
                throw error;
            }

            setProgress(100);
            toast.success('Redirecting to Google for authentication...');

            if (data?.url) {
                window.location.href = data.url;
            }

            return { success: true, redirectTo: data?.url || null };
        } catch (error) {
            logger.error('Google signup error', { error: error.message });
            const errorMessage = getAuthErrorMessage(error);
            toast.error(errorMessage);

            return {
                success: false,
                error: error?.code || 'auth_error',
                message: errorMessage
            };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Check remaining login attempts
    const getRemainingAttempts = useCallback((email) => {
        return rateLimiter.getRemainingAttempts(email);
    }, []);

    // Check if user is locked out
    const isLockedOut = useCallback((email) => {
        return !rateLimiter.isAllowed(email);
    }, []);

    return {
        loading,
        progress,
        login,
        signup,
        signupWithGoogle,
        resetPassword,
        getRemainingAttempts,
        isLockedOut
    };
};