import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';

export const AuthCallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuthStatus, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 AuthCallbackPage: Starting callback handling');
      
      try {
        // Check for OAuth errors in URL
        const oauthError = authService.getOAuthError();
        if (oauthError) {
          console.error('❌ OAuth error found:', oauthError);
          setError(getErrorMessage(oauthError));
          setIsProcessing(false);
          return;
        }

        console.log('✅ No OAuth errors, checking auth status...');
        
        // Check authentication status after OAuth callback
        await checkAuthStatus();
        
        console.log('✅ Auth status check complete');
        setIsProcessing(false);
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [checkAuthStatus]);

  // Navigate to chat when authentication is confirmed
  useEffect(() => {
    if (!isProcessing) {
      if (isAuthenticated && user) {
        console.log('🚀 Authentication confirmed, navigating to /chat');
        console.log('🔍 User data:', { id: user.id, email: user.email, name: user.name });
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          navigate('/chat', { replace: true });
        }, 100);
      } else {
        console.log('❌ Authentication failed, navigating to home');
        console.log('🔍 Auth state:', { isAuthenticated, hasUser: !!user });
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
    }
  }, [isProcessing, isAuthenticated, user, navigate]);

  // Clean up URL parameters after processing
  useEffect(() => {
    if (!isProcessing) {
      authService.clearOAuthParams();
    }
  }, [isProcessing]);

  // Show loading state while processing
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          <p className="text-white/70 text-sm">Completing authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-400 mb-2">Authentication Failed</h1>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state during processing (navigation handled by useEffect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
        <p className="text-white/70 text-sm">Redirecting...</p>
      </div>
    </div>
  );
};

// Helper function to get user-friendly error messages
function getErrorMessage(error: string): string {
  switch (error) {
    case 'authentication_failed':
      return 'Google authentication was cancelled or failed.';
    case 'user_not_found':
      return 'Unable to create or find your user account.';
    case 'server_error':
      return 'A server error occurred during authentication.';
    case 'access_denied':
      return 'Google access was denied. Please try again.';
    default:
      return `Authentication error: ${error}`;
  }
} 