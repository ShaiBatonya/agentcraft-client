import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthStore } from '@/stores/auth.store';

export const OAuthDebugPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthActions();
  const { isAuthenticated, user } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<{
    error?: string;
    message?: string;
    authCheckResult?: string;
    cookies?: string;
  }>({});

  useEffect(() => {
    // Get params from URL
    const error = searchParams.get('error') || undefined;
    const message = searchParams.get('message') || undefined;
    const cookies = document.cookie;

    setDebugInfo({ error, message, cookies });

    // Automatically test authentication when page loads
    console.log('🔍 OAuth Debug: Testing authentication...');
    
    checkAuthStatus()
      .then(() => {
        console.log('✅ OAuth Debug: Authentication check successful');
        setDebugInfo(prev => ({ ...prev, authCheckResult: 'success' }));
      })
      .catch((error) => {
        console.error('❌ OAuth Debug: Authentication check failed:', error);
        setDebugInfo(prev => ({ ...prev, authCheckResult: `failed: ${error.message}` }));
      });
  }, [searchParams, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
        
        {/* Authentication Status */}
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-6 mb-6">
          <h2 className="text-blue-400 text-lg font-semibold mb-2">
            🔍 Authentication Status
          </h2>
          <p className="text-blue-300 mb-4">
            Testing secure cookie-based authentication...
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
          
          {/* Security Note */}
          <div className="bg-green-900/30 p-3 rounded">
            <p className="text-xs text-green-400">
              🔒 Secure: JWT tokens are stored in HttpOnly cookies, not exposed in URLs
            </p>
          </div>
          
          {isAuthenticated && (
            <p className="text-green-300 mt-4">
              ✅ Authentication successful! You can navigate to protected routes.
            </p>
          )}
        </div>

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

        {/* No Error State */}
        {!debugInfo.error && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h3 className="text-gray-300 text-lg font-semibold mb-2">
              🔧 Debug Actions
            </h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => checkAuthStatus()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
              >
                Refresh Auth Status
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm"
              >
                Go to Chat
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 