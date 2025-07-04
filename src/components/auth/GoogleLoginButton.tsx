import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authService } from '@/services/auth.service';

interface GoogleLoginButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onLoginStart?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  variant = 'secondary',
  size = 'lg',
  fullWidth = false,
  className = '',
  onLoginStart,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    // Prevent multiple clicks
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      onLoginStart?.();
      
      // Small delay to show loading state before redirect
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Initiate OAuth redirect
      authService.initiateGoogleLogin();
    } catch (error) {
      console.error('Login initiation failed:', error);
      setIsLoading(false);
    }
  }, [isLoading, onLoginStart]);

  const GoogleIcon = () => (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <Button
      onClick={handleGoogleLogin}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isLoading}
      leftIcon={isLoading ? <LoadingSpinner size="sm" /> : <GoogleIcon />}
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      {isLoading ? 'Redirecting to Google...' : 'Continue with Google'}
    </Button>
  );
}; 