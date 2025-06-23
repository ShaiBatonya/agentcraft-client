import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { useAuthToasts } from '@/stores/toast.store';

export const AuthCallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<string>('Initializing authentication...');
  const [errorType, setErrorType] = useState<'network' | 'auth' | 'timeout' | 'server' | 'unknown' | null>(null);
  const [showRetryOptions, setShowRetryOptions] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const { showLoginSuccess, showLoginFailed, showAuthTimeout, showAuthDenied, showNetworkError, showServerError } = useAuthToasts();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing authentication...');
        
        // Check for error parameters in URL
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const messageParam = urlParams.get('message');
        
        if (errorParam) {
          const errorMessage = messageParam ? decodeURIComponent(messageParam) : errorParam;
          const { message, type } = classifyError(errorMessage);
          setError(message);
          setErrorType(type);
          setShowRetryOptions(type !== 'auth'); // Don't show retry for auth denial
          
          // Show appropriate toast notification
          switch (type) {
            case 'auth':
              showAuthDenied();
              break;
            case 'network':
              showNetworkError();
              break;
            case 'server':
              showServerError();
              break;
            default:
              showLoginFailed(message);
          }
          
          setIsProcessing(false);
          return;
        }

        // If we have a success parameter or no error, proceed to verify authentication
        setStatus('Verifying authentication with server...');
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Verify authentication via secure cookie
        await pollAuth();
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, []);

  // Enhanced authentication verification with better error handling and debugging
  const pollAuth = async (retries = 10): Promise<void> => {
    console.log('🔍 Starting auth verification polling...');
    
    for (let i = 0; i < retries; i++) {
      setAttempts(i + 1);
      setStatus(`Verifying authentication (${i + 1}/${retries})...`);
      
      try {
        // Progressive wait times: longer initial wait, then shorter intervals
        const waitTime = i === 0 ? 1500 : i === 1 ? 1000 : 600;
        console.log(`⏱️  Attempt ${i + 1}: Waiting ${waitTime}ms before auth check...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.log(`🔍 Attempt ${i + 1}: Making auth request to /api/auth/me...`);
        
        // Check current cookies for debugging
        const cookies = document.cookie;
        console.log(`🍪 Current cookies: ${cookies || 'none'}`);
        
        const user = await authService.getCurrentUser();
        
        if (user) {
          // Success! Update Zustand store and redirect
          console.log('✅ Authentication successful!', user);
          setStatus('Authentication successful! Redirecting to dashboard...');
          setUser(user);
          
          // Show success toast
          showLoginSuccess(user.name);
          
          // Clean up OAuth state
          authService.cleanupOAuthState();
          
          // Small delay to show success message
          await new Promise(resolve => setTimeout(resolve, 1000));
          navigate('/chat', { replace: true });
          return;
        } else {
          console.log(`⚠️  Attempt ${i + 1}: No user data returned`);
        }
      } catch (authError) {
        const error = authError as Error & { status?: number; response?: { data?: unknown } };
        console.error(`❌ Auth attempt ${i + 1} failed:`, {
          message: error.message,
          status: error.status,
          response: error.response?.data
        });
        
        // If it's a 401, the cookie might not be set yet - continue polling
        // If it's a different error, log it but continue
        if (i < retries - 1) {
          const remainingRetries = retries - i - 1;
          setStatus(`Verification failed, ${remainingRetries} attempts remaining...`);
        }
      }
      
      // Wait between attempts (except on last attempt)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // All retries exhausted
    console.error('❌ All auth verification attempts failed');
    const { message, type } = classifyError('timeout');
    setError(message);
    setErrorType(type);
    setShowRetryOptions(true);
    
    // Show timeout toast
    showAuthTimeout();
    
    setIsProcessing(false);
  };

  // Enhanced loading screen that eliminates any flashing
  if (isProcessing) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 loading-optimized"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        <div className="flex flex-col items-center space-y-8 animate-optimized">
          {/* Enhanced spinner with glow effect */}
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-lg" />
            <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-2 border-indigo-400/30" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border border-indigo-500/20" />
          </div>
          
          <div className="text-center space-y-4 max-w-md">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">AgentCraft</h1>
            </div>
            
            <p className="text-white font-medium text-lg">
              {status}
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < attempts 
                      ? 'bg-indigo-500 scale-125' 
                      : i === attempts 
                        ? 'bg-indigo-400 animate-pulse scale-110' 
                        : 'bg-gray-600 scale-100'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-400 text-sm">
              Please wait while we complete your authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry options
  if (error) {
    const handleQuickRetry = () => {
      setRetryCount(prev => prev + 1);
      setError(null);
      setErrorType(null);
      setShowRetryOptions(false);
      setIsProcessing(true);
      setStatus('Retrying authentication...');
      
      // Restart the polling process
      pollAuth();
    };

    const getErrorIcon = () => {
      switch (errorType) {
        case 'network':
          return (
            <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          );
        case 'timeout':
          return (
            <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'server':
          return (
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          );
        default:
          return (
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
      }
    };

    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        <div className="text-center max-w-lg mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              {getErrorIcon()}
            </div>
            <h1 className="text-2xl font-semibold text-red-400 mb-4">Authentication Failed</h1>
            <p className="text-white/80 mb-6 leading-relaxed">{error}</p>
            
            {retryCount > 0 && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Retry attempt #{retryCount}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {showRetryOptions && retryCount < 3 && (errorType === 'timeout' || errorType === 'network' || errorType === 'server') && (
                <button
                  onClick={handleQuickRetry}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors mb-3 font-medium"
                >
                  🔄 Try Again ({3 - retryCount} attempts left)
                </button>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/', { replace: true })}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {errorType === 'auth' ? 'Try Different Account' : 'Fresh Login'}
                </button>
              </div>
              
              {(errorType === 'server' || errorType === 'unknown') && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-xs">
                    💡 If this issue persists, try clearing your browser cookies and cache, or contact support.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading state (should never be reached)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

// Enhanced error classification with retry guidance
function classifyError(error: string): { message: string; type: 'network' | 'auth' | 'timeout' | 'server' | 'unknown' } {
  switch (error) {
    case 'oauth_failed':
    case 'access_denied':
    case 'authentication_failed':
      return {
        message: 'Google authentication was cancelled or denied. Please try signing in again and grant the necessary permissions.',
        type: 'auth'
      };
    case 'no_user_data':
    case 'user_not_found':
      return {
        message: 'Unable to retrieve your account information. This might be a temporary issue - please try again.',
        type: 'server'
      };
    case 'server_error':
      return {
        message: 'A server error occurred during authentication. Please wait a moment and try again.',
        type: 'server'
      };
    case 'timeout':
      return {
        message: 'Authentication is taking longer than expected. This could be due to network issues or server load.',
        type: 'timeout'
      };
    case 'network':
      return {
        message: 'Unable to connect to the authentication server. Please check your internet connection and try again.',
        type: 'network'
      };
    default:
      return {
        message: 'An unexpected error occurred during authentication. Please try again or contact support if the issue persists.',
        type: 'unknown'
      };
  }
} 