import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthStore } from '@/stores/auth.store';

export const OAuthDebugPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthActions();
  const { isAuthenticated, user } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<{
    token?: string;
    error?: string;
    message?: string;
    authCheckResult?: string;
    cookies?: string;
  }>({});

  useEffect(() => {
    // Get params from URL
    const token = searchParams.get('token') || undefined;
    const error = searchParams.get('error') || undefined;
    const message = searchParams.get('message') || undefined;
    const cookies = document.cookie;

    setDebugInfo({ token, error, message, cookies });

    // If we have a token, test authentication immediately
    if (token) {
      console.log('🔍 OAuth Debug: Token received, testing authentication...');
      
      // Test if the cookie was set properly by calling /auth/me
      checkAuthStatus()
        .then(() => {
          console.log('✅ OAuth Debug: Authentication check successful');
          setDebugInfo(prev => ({ ...prev, authCheckResult: 'success' }));
          
          // Wait a bit to show debug info, then redirect
          setTimeout(() => {
            navigate('/');
          }, 3000);
        })
        .catch((error) => {
          console.error('❌ OAuth Debug: Authentication check failed:', error);
          setDebugInfo(prev => ({ ...prev, authCheckResult: `failed: ${error.message}` }));
        });
    }
  }, [searchParams, checkAuthStatus, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
        
        {/* Success State */}
        {debugInfo.token && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-6 mb-6">
            <h2 className="text-green-400 text-lg font-semibold mb-2">
              ✅ Authentication Token Received
            </h2>
            <p className="text-green-300 mb-4">
              Testing authentication with backend...
            </p>
            
            {/* Auth Status */}
            <div className="mb-4 p-3 bg-black/30 rounded">
              <p className="text-sm">
                <span className="text-gray-400">Auth Status:</span>{' '}
                <span className={isAuthenticated ? 'text-green-400' : 'text-yellow-400'}>
                  {isAuthenticated ? '✅ Authenticated' : '⏳ Checking...'}
                </span>
              </p>
              {user && (
                <p className="text-sm mt-1">
                  <span className="text-gray-400">User:</span>{' '}
                  <span className="text-blue-400">{user.email}</span>
                </p>
              )}
              {debugInfo.authCheckResult && (
                <p className="text-sm mt-1">
                  <span className="text-gray-400">Check Result:</span>{' '}
                  <span className={debugInfo.authCheckResult === 'success' ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.authCheckResult}
                  </span>
                </p>
              )}
            </div>
            
            {/* Cookies Debug */}
            <div className="mb-4 p-3 bg-black/30 rounded">
              <p className="text-sm">
                <span className="text-gray-400">Cookies:</span>{' '}
                <span className={debugInfo.cookies ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.cookies ? 'Present' : 'None'}
                </span>
              </p>
              {debugInfo.cookies && (
                <p className="text-xs mt-1 font-mono text-gray-500 break-all">
                  {debugInfo.cookies}
                </p>
              )}
            </div>
            
            {/* Token Debug */}
            <div className="bg-black/50 p-4 rounded">
              <p className="text-sm text-gray-400 mb-2">Token:</p>
              <p className="font-mono text-xs break-all">
                {debugInfo.token}
              </p>
            </div>
            
            {isAuthenticated && (
              <p className="text-green-300 mt-4">
                ✅ Authentication successful! Redirecting to home page...
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {debugInfo.error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 text-lg font-semibold mb-2">
              ❌ Authentication Error
            </h2>
            <p className="text-red-300 mb-2">
              Error Type: <span className="font-mono">{debugInfo.error}</span>
            </p>
            {debugInfo.message && (
              <p className="text-red-300">
                Message: <span className="font-mono">{debugInfo.message}</span>
              </p>
            )}
            <div className="mt-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!debugInfo.token && !debugInfo.error && (
          <div className="animate-pulse bg-blue-900/50 border border-blue-500 rounded-lg p-6">
            <p className="text-blue-300">
              Processing authentication response...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 