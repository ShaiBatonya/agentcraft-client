import React, { useState } from 'react';
import { useAuthStore, useUser, useAuthActions } from '@/stores/auth.store';
import { Button } from '@/shared/ui/Button';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const user = useUser();
  const { isLoading } = useAuthStore();
  const { logout } = useAuthActions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user || isLoading) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* User Avatar and Info */}
      <div className="flex items-center space-x-3">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name || user.email}
            className="h-8 w-8 rounded-full object-cover border border-white/20"
          />
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white">
            {user.name}
          </p>
          <p className="text-xs text-white/70">{user.email}</p>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="secondary"
        size="sm"
        disabled={isLoggingOut}
        className="text-white/80 hover:text-white border-white/20 hover:border-white/30"
      >
        {isLoggingOut ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Logging out...
          </>
        ) : (
          'Logout'
        )}
      </Button>
    </div>
  );
}; 