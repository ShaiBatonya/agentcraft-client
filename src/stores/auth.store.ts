import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@/types';
import { apiService } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  // Google OAuth will handle login via redirect, so we mainly need these actions:
  getCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        getCurrentUser: async () => {
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            const response = await apiService.auth.me();
            
            set(state => {
              state.user = response.data;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          } catch (error) {
            set(state => {
              state.isLoading = false;
              state.error = error instanceof Error ? error.message : 'Failed to get user';
              state.isAuthenticated = false;
              state.user = null;
            });
          }
        },

        logout: async () => {
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            await apiService.auth.logout();
            
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
            });
          } catch (error) {
            // Even if logout fails on server, clear local state
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = error instanceof Error ? error.message : 'Logout failed';
            });
          }
        },

        checkAuthStatus: async () => {
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            // This will check if the user has a valid auth cookie
            await get().getCurrentUser();
          } catch {
            // If auth check fails, user is not authenticated
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null; // Don't show error for failed auth check
            });
          }
        },

        setUser: (user: User | null) => {
          set(state => {
            state.user = user;
            state.isAuthenticated = !!user;
          });
        },

        clearError: () => {
          set(state => {
            state.error = null;
          });
        },

        setLoading: (loading: boolean) => {
          set(state => {
            state.isLoading = loading;
          });
        },
      })),
      {
        name: 'auth-store',
        // Only persist user and auth status, not loading/error states
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);

// Actions
export const useAuthActions = () => useAuthStore(state => ({
  getCurrentUser: state.getCurrentUser,
  logout: state.logout,
  checkAuthStatus: state.checkAuthStatus,
  clearError: state.clearError,
  setLoading: state.setLoading,
  setUser: state.setUser,
})); 