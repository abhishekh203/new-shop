import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/supabaseConfig';
import logger from '../../utils/logger';

/**
 * Custom hook for Supabase authentication management
 * Handles user verification, auth state changes, and user data fetching
 * @param {Object} options - Configuration options
 * @param {boolean} options.fetchUserRecord - Whether to fetch additional user data from users table
 * @param {Function} options.onAuthChange - Callback for auth state changes
 * @param {Function} options.onError - Error callback function
 * @returns {Object} - Authentication state and methods
 */
const useSupabaseAuth = (options = {}) => {
  const {
    fetchUserRecord = true,
    onAuthChange,
    onError = (error) => logger.error('Supabase auth error:', { error: error.message || error })
  } = options;

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verify and fetch user data
  const verifyUser = useCallback(async () => {
    try {
      setUserLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return null;
      }

      let userData = {
        id: user.id,
        email: user.email,
        ...user.user_metadata
      };

      // Fetch additional user data from users table if requested
      if (fetchUserRecord) {
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (userError) {
          logger.warn('Error fetching user record:', { error: userError.message });
        } else if (userRecord) {
          userData = {
            ...userData,
            ...userRecord
          };
        }
      }

      setCurrentUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      onError(error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setUserLoading(false);
    }
  }, [fetchUserRecord, onError]);

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      onError(error);
      throw error;
    }
  }, [onError]);

  // Refresh user data
  const refreshUser = useCallback(() => {
    return verifyUser();
  }, [verifyUser]);

  // Setup auth state listener
  useEffect(() => {
    // Initial verification
    verifyUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed:', { event, hasSession: !!session });
      
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await verifyUser();
      }

      // Call custom auth change handler if provided
      if (onAuthChange) {
        onAuthChange(event, session, currentUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifyUser, onAuthChange, currentUser]);

  return {
    // State
    currentUser,
    userLoading,
    isAuthenticated,
    
    // Methods
    verifyUser,
    signOut,
    refreshUser,
    
    // Computed values
    userId: currentUser?.id || currentUser?.uid || null,
    userEmail: currentUser?.email || null,
    userRole: currentUser?.role || null
  };
};

export default useSupabaseAuth;
