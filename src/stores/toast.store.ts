import { create } from 'zustand';
import type { ToastMessage, ToastType } from '@/components/ui/Toast';

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (type, message, duration = 4000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const toast: ToastMessage = {
      id,
      type,
      message,
      duration
    };
    
    set(state => ({
      toasts: [...state.toasts, toast]
    }));
  },
  
  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  }
}));

// Action hooks for convenience
export const useAddToast = () => useToastStore(state => state.addToast);
export const useRemoveToast = () => useToastStore(state => state.removeToast);
export const useToasts = () => useToastStore(state => state.toasts);

// Auth-specific toast helpers
export const useAuthToasts = () => {
  const addToast = useAddToast();
  
  return {
    showLoginSuccess: (userName?: string) => 
      addToast('success', `Welcome back${userName ? `, ${userName}` : ''}! 🎉`, 5000),
    
    showLoginFailed: (reason?: string) => 
      addToast('error', reason || 'Login failed. Please try again.', 6000),
    
    showSessionExpired: () => 
      addToast('warning', 'Your session has expired. Please sign in again.', 6000),
    
    showLogoutSuccess: () => 
      addToast('info', 'Successfully signed out. See you soon! 👋', 4000),
    
    showAuthTimeout: () => 
      addToast('warning', 'Authentication is taking longer than expected...', 8000),
    
    showAuthDenied: () => 
      addToast('error', 'Authentication was denied. Please try again and grant permissions.', 6000),
    
    showNetworkError: () => 
      addToast('error', 'Network error. Please check your connection and try again.', 6000),
    
    showServerError: () => 
      addToast('error', 'Server error. Please try again in a moment.', 6000),
  };
}; 