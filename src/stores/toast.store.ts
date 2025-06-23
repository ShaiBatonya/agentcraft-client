import toast from 'react-hot-toast';

// Enhanced toast configuration with professional styling
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.95)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '420px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
  },
  success: {
    iconTheme: {
      primary: '#10B981',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid rgba(16, 185, 129, 0.3)',
      background: 'rgba(16, 185, 129, 0.1)',
    },
  },
  error: {
    iconTheme: {
      primary: '#EF4444',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid rgba(239, 68, 68, 0.3)',
      background: 'rgba(239, 68, 68, 0.1)',
    },
  },
  loading: {
    iconTheme: {
      primary: '#3B82F6',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid rgba(59, 130, 246, 0.3)',
      background: 'rgba(59, 130, 246, 0.1)',
    },
  },
};

// Enhanced toast utilities with better UX
export const showToast = {
  success: (message: string, options?: { duration?: number; emoji?: string }) => {
    return toast.success(
      `${options?.emoji || '✅'} ${message}`,
      {
        ...toastConfig,
        ...toastConfig.success,
        duration: options?.duration || 4000,
      }
    );
  },

  error: (message: string, options?: { duration?: number; emoji?: string }) => {
    return toast.error(
      `${options?.emoji || '❌'} ${message}`,
      {
        ...toastConfig,
        ...toastConfig.error,
        duration: options?.duration || 6000,
      }
    );
  },

  loading: (message: string, options?: { duration?: number }) => {
    return toast.loading(
      message,
      {
        ...toastConfig,
        ...toastConfig.loading,
        duration: options?.duration || Infinity,
      }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: { duration?: number }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...toastConfig,
        duration: options?.duration,
        success: {
          ...toastConfig.success,
          duration: 4000,
        },
        error: {
          ...toastConfig.error,
          duration: 6000,
        },
        loading: {
          ...toastConfig.loading,
        },
      }
    );
  },

  custom: (content: string, options?: { duration?: number }) => {
    return toast(
      content,
      {
        duration: options?.duration || 4000,
        position: toastConfig.position,
        style: toastConfig.style,
      }
    );
  },

  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },

  remove: (toastId?: string) => {
    return toast.remove(toastId);
  },
};

// Professional auth-specific toast helpers with enhanced UX
export const useAuthToasts = () => {
  return {
    showLoginSuccess: (userName?: string) => {
      const message = userName 
        ? `Welcome back, ${userName}!` 
        : 'Welcome back!';
      
      return showToast.success(message, { 
        duration: 5000, 
        emoji: '🎉' 
      });
    },

    showLoginFailed: (reason?: string) => {
      const message = reason 
        ? `Login failed: ${reason}` 
        : 'Login failed. Please try again.';
      
      return showToast.error(message, { 
        duration: 6000, 
        emoji: '🔐' 
      });
    },

    showSessionExpired: () => {
      return showToast.error('Your session has expired. Please sign in again.', { 
        duration: 6000, 
        emoji: '⏰' 
      });
    },

    showLogoutSuccess: () => {
      return showToast.success('Successfully signed out. See you soon!', { 
        duration: 4000, 
        emoji: '👋' 
      });
    },

    showAuthTimeout: () => {
      return showToast.error('Authentication is taking longer than expected...', { 
        duration: 8000, 
        emoji: '⏳' 
      });
    },

    showAuthDenied: () => {
      return showToast.error('Authentication was denied. Please try again and grant permissions.', { 
        duration: 6000, 
        emoji: '🚫' 
      });
    },

    showNetworkError: () => {
      return showToast.error('Network error. Please check your connection and try again.', { 
        duration: 6000, 
        emoji: '🌐' 
      });
    },

    showServerError: () => {
      return showToast.error('Server error. Please try again in a moment.', { 
        duration: 6000, 
        emoji: '🔧' 
      });
    },

    showLoginPromise: (promise: Promise<{ user?: { name?: string } }>) => {
      return showToast.promise(
        promise,
        {
          loading: 'Signing you in...',
          success: (data) => `Welcome back${data?.user?.name ? `, ${data.user.name}` : ''}! 🎉`,
          error: (error) => `Login failed: ${error?.message || 'Please try again'}`,
        },
        { duration: 5000 }
      );
    },

    showLogoutPromise: (promise: Promise<void>) => {
      return showToast.promise(
        promise,
        {
          loading: 'Signing you out...',
          success: 'Successfully signed out. See you soon! 👋',
          error: 'Logout failed. Please try again.',
        },
        { duration: 4000 }
      );
    },
  };
};

// Chat-specific toast helpers
export const useChatToasts = () => {
  return {
    showMessageSent: () => {
      return showToast.success('Message sent successfully!', { 
        duration: 2000, 
        emoji: '📨' 
      });
    },

    showMessageFailed: (reason?: string) => {
      const message = reason 
        ? `Failed to send message: ${reason}` 
        : 'Failed to send message. Please try again.';
      
      return showToast.error(message, { 
        duration: 5000, 
        emoji: '💬' 
      });
    },

    showThreadCreated: () => {
      return showToast.success('New conversation started!', { 
        duration: 3000, 
        emoji: '✨' 
      });
    },

    showThreadDeleted: () => {
      return showToast.success('Conversation deleted', { 
        duration: 3000, 
        emoji: '🗑️' 
      });
    },

    showCopiedToClipboard: () => {
      return showToast.success('Copied to clipboard!', { 
        duration: 2000, 
        emoji: '📋' 
      });
    },

    showSendingMessage: (promise: Promise<void>) => {
      return showToast.promise(
        promise,
        {
          loading: 'Sending message...',
          success: 'Message sent! 📨',
          error: 'Failed to send message',
        },
        { duration: 3000 }
      );
    },
  };
};

// App-specific toast helpers
export const useAppToasts = () => {
  return {
    showSaved: (item?: string) => {
      const message = item ? `${item} saved successfully!` : 'Changes saved!';
      return showToast.success(message, { 
        duration: 3000, 
        emoji: '💾' 
      });
    },

    showDeleted: (item?: string) => {
      const message = item ? `${item} deleted` : 'Item deleted';
      return showToast.success(message, { 
        duration: 3000, 
        emoji: '🗑️' 
      });
    },

    showUpdated: (item?: string) => {
      const message = item ? `${item} updated!` : 'Updated successfully!';
      return showToast.success(message, { 
        duration: 3000, 
        emoji: '✏️' 
      });
    },

    showError: (message: string) => {
      return showToast.error(message, { 
        duration: 5000, 
        emoji: '⚠️' 
      });
    },

    showConnectionRestored: () => {
      return showToast.success('Connection restored!', { 
        duration: 3000, 
        emoji: '🌐' 
      });
    },

    showConnectionLost: () => {
      return showToast.error('Connection lost. Trying to reconnect...', { 
        duration: 6000, 
        emoji: '📡' 
      });
    },
  };
};

// Legacy exports for backward compatibility
export const useAddToast = () => {
  return (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => {
    switch (type) {
      case 'success':
        return showToast.success(message, { duration });
      case 'error':
        return showToast.error(message, { duration });
      default:
        return showToast.success(message, { duration });
    }
  };
};

export const useRemoveToast = () => showToast.dismiss;
export const useToasts = () => ({ toasts: [] }); // Empty for compatibility

// Toast configuration for app-wide usage
export { toastConfig };
export default showToast; 