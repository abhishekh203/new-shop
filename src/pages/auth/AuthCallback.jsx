import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseConfig';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import logger from '../../utils/logger';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken) {
          // This is an email confirmation
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            logger.error('Auth callback error:', { error: error.message || error });
            setStatus('error');
            setMessage('Failed to verify email. Please try again.');
            return;
          }

          if (data.session?.user) {
            // Update the user's email verification status in our users table
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                email_verified: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', data.session.user.id);

            if (updateError) {
              logger.error('Failed to update email verification:', { error: updateError.message || updateError });
            }

            setStatus('success');
            setMessage('Email verified successfully! Redirecting to login...');
            
            // Redirect after success
            setTimeout(() => {
              navigate('/login?verified=true', { replace: true });
            }, 2000);
          } else {
            setStatus('error');
            setMessage('No active session found. Please try signing up again.');
          }
        } else if (type === 'recovery') {
          // Password reset flow
          setStatus('success');
          setMessage('Password reset confirmed. You can now set a new password.');
          setTimeout(() => {
            navigate('/reset-password', { replace: true });
          }, 2000);
        } else {
          // Default case - redirect to login
          setStatus('success');
          setMessage('Authentication successful. Redirecting...');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
        }
      } catch (error) {
        logger.error('Auth callback error:', { error: error.message || error });
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-4xl mb-4" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-4xl mb-4" />;
      default:
        return <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Success!';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <div className="max-w-md w-full bg-white border border-amber-200 shadow-lg rounded-lg p-8 text-center">
        {getIcon()}
        <h1 className={`text-2xl font-semibold mb-3 ${
          status === 'success' ? 'text-green-700' : 
          status === 'error' ? 'text-red-700' : 
          'text-gray-900'
        }`}>
          {getTitle()}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/signup', { replace: true })}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Signup
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

