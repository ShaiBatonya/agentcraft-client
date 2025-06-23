import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/stores/auth.store';
import type { User } from '@/types';

export const OAuthDebugPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthActions();
  const [debugInfo, setDebugInfo] = useState<{
    token?: string;
    error?: string;
    message?: string;
  }>({});

  useEffect(() => {
    // Get params from URL
    const token = searchParams.get('token') || undefined;
    const error = searchParams.get('error') || undefined;
    const message = searchParams.get('message') || undefined;

    setDebugInfo({ token, error, message });

    // If we have a token, try to use it
    if (token) {
      // Set temporary user while loading
      const tempUser: User = {
        id: 'temp',
        name: 'Loading...',
        email: 'loading@example.com',
        role: 'user',
        isAdmin: false
      };
      
      setUser(tempUser);
      
      // Wait a bit to show debug info, then redirect
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [searchParams, setUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
        
        {/* Success State */}
        {debugInfo.token && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-6 mb-6">
            <h2 className="text-green-400 text-lg font-semibold mb-2">
              ✅ Authentication Successful
            </h2>
            <p className="text-green-300 mb-4">
              Token received and stored. Redirecting to home page...
            </p>
            <div className="bg-black/50 p-4 rounded">
              <p className="font-mono text-xs break-all">
                {debugInfo.token}
              </p>
            </div>
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