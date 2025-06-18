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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
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
        login: async (email: string, password: string) => {
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            const response = await apiService.auth.login(email, password);
            
            set(state => {
              state.user = response.data.user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          } catch (error) {
            set(state => {
              state.isLoading = false;
              state.error = error instanceof Error ? error.message : 'Login failed';
              state.isAuthenticated = false;
              state.user = null;
            });
            throw error;
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

        refreshToken: async () => {
          try {
            await apiService.auth.refreshToken();
            // If refresh succeeds, get updated user data
            await get().getCurrentUser();
          } catch (error) {
            // If refresh fails, user needs to login again
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.error = 'Session expired. Please login again.';
            });
            throw error;
          }
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
  login: state.login,
  logout: state.logout,
  getCurrentUser: state.getCurrentUser,
  refreshToken: state.refreshToken,
  clearError: state.clearError,
  setLoading: state.setLoading,
})); 