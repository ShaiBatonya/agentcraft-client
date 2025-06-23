import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';

export const AuthCallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<string>('Initializing authentication...');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

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
          setError(getErrorMessage(errorMessage));
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
    setError('Authentication verification failed. The cookie may not have been set properly. Please try logging in again.');
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

  // Enhanced error state
  if (error) {
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
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-red-400 mb-4">Authentication Failed</h1>
            <p className="text-white/80 mb-6 leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/', { replace: true })}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors touch-optimized"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg transition-colors touch-optimized"
              >
                Try Again
              </button>
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

// Helper function to get user-friendly error messages
function getErrorMessage(error: string): string {
  switch (error) {
    case 'oauth_failed':
      return 'Google OAuth authentication failed. Please try signing in again.';
    case 'no_user_data':
      return 'No user data received from Google. Please try again or contact support.';
    case 'user_not_found':
      return 'Unable to create or find your user account. Please contact support if this persists.';
    case 'server_error':
      return 'A server error occurred during authentication. Please try again in a moment.';
    case 'access_denied':
      return 'Google access was denied. Please try again and approve the necessary permissions.';
    case 'authentication_failed':
      return 'Google authentication was cancelled or failed. Please try signing in again.';
    default:
      return `Authentication error: ${error}`;
  }
} 