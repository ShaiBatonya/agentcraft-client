import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { useIsAuthenticated } from '@/stores/auth.store';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoToChat = () => {
    navigate('/chat', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="glass-card-subtle p-8 text-center">
          {/* 404 Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-accent-400">404</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-white/70 mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              variant="primary"
              size="lg"
              fullWidth
              className="mb-2"
            >
              Go to Homepage
            </Button>
            
            {isAuthenticated && (
              <Button
                onClick={handleGoToChat}
                variant="secondary"
                size="lg"
                fullWidth
              >
                Go to Chat
              </Button>
            )}
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">
              If you believe this is an error, please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 