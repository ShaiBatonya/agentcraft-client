import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface DebugInfo {
  currentUrl: string;
  pathname: string;
  search: string;
  hash: string;
  urlParams: Record<string, string>;
  isCallbackPage: boolean;
  hasCode: boolean;
  hasState: boolean;
  hasError: boolean;
  storedState: string | null;
  cookies: string;
  isAuthenticated: boolean;
  userEmail: string;
  timestamp: string;
}

export const OAuthDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<Partial<DebugInfo>>({});
  const { isAuthenticated, user, checkAuthStatus } = useAuthStore();

  const updateDebugInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const allParams = Object.fromEntries(urlParams.entries());
    
    setDebugInfo({
      currentUrl: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      urlParams: allParams,
      isCallbackPage: authService.isOAuthCallback(),
      hasCode: urlParams.has('code'),
      hasState: urlParams.has('state'),
      hasError: urlParams.has('error'),
      storedState: localStorage.getItem('oauth_state'),
      cookies: document.cookie,
      isAuthenticated,
      userEmail: user?.email || 'none',
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleTestLogin = () => {
    console.log('🧪 Debug: Testing Google OAuth login');
    updateDebugInfo();
    authService.initiateGoogleLogin();
  };

  const handleCheckAuth = async () => {
    console.log('🧪 Debug: Checking auth status');
    await checkAuthStatus();
    updateDebugInfo();
  };

  const handleClearStorage = () => {
    console.log('🧪 Debug: Clearing storage');
    localStorage.clear();
    sessionStorage.clear();
    updateDebugInfo();
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-slate-800 border border-slate-600 rounded-lg p-4 text-xs max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">OAuth Debug</h3>
        <button
          onClick={updateDebugInfo}
          className="text-blue-400 hover:text-blue-300"
          title="Refresh debug info"
        >
          🔄
        </button>
      </div>
      
      <div className="space-y-2 text-slate-300">
        <div>
          <span className="text-slate-400">Auth Status:</span>{' '}
          <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
            {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
          </span>
        </div>
        
        <div>
          <span className="text-slate-400">User:</span> {debugInfo.userEmail}
        </div>
        
        <div>
          <span className="text-slate-400">Page:</span> {debugInfo.pathname}
        </div>
        
        <div>
          <span className="text-slate-400">Is Callback:</span>{' '}
          <span className={debugInfo.isCallbackPage ? 'text-yellow-400' : 'text-slate-400'}>
            {debugInfo.isCallbackPage ? 'Yes' : 'No'}
          </span>
        </div>
        
        {debugInfo.isCallbackPage && (
          <>
            <div>
              <span className="text-slate-400">Has Code:</span>{' '}
              <span className={debugInfo.hasCode ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.hasCode ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <span className="text-slate-400">Has State:</span>{' '}
              <span className={debugInfo.hasState ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.hasState ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <span className="text-slate-400">Has Error:</span>{' '}
              <span className={debugInfo.hasError ? 'text-red-400' : 'text-green-400'}>
                {debugInfo.hasError ? 'Yes' : 'No'}
              </span>
            </div>
          </>
        )}
        
        <div>
          <span className="text-slate-400">URL Params:</span>{' '}
          {Object.keys(debugInfo.urlParams || {}).length === 0 ? (
            <span className="text-slate-500">none</span>
          ) : (
            <div className="text-xs mt-1">
              {Object.entries(debugInfo.urlParams || {}).map(([key, value]) => (
                <div key={key} className="ml-2">
                  <span className="text-blue-400">{key}:</span> {String(value).substring(0, 20)}
                  {String(value).length > 20 && '...'}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {debugInfo.storedState && (
          <div>
            <span className="text-slate-400">Stored State:</span>{' '}
            <span className="text-yellow-400">{debugInfo.storedState.substring(0, 8)}...</span>
          </div>
        )}
        
        <div>
          <span className="text-slate-400">Cookies:</span>{' '}
          {debugInfo.cookies ? (
            <span className="text-green-400">Present</span>
          ) : (
            <span className="text-red-400">None</span>
          )}
        </div>
      </div>
      
      <div className="flex gap-1 mt-3">
        <button
          onClick={handleTestLogin}
          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Test Login
        </button>
        <button
          onClick={handleCheckAuth}
          className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          Check Auth
        </button>
        <button
          onClick={handleClearStorage}
          className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Clear
        </button>
      </div>
      
      <div className="text-xs text-slate-500 mt-2">
        Updated: {debugInfo.timestamp?.split('T')[1]?.split('.')[0]}
      </div>
    </div>
  );
}; 