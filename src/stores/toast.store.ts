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
    const id = Math.random().toString(36).substring(7);
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