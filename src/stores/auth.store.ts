import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User } from '@/types';
import { authService, AuthenticationError } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  lastActivity: number | null;
  // Performance enhancements
  userCache: {
    data: User | null;
    timestamp: number | null;
    ttl: number; // Time to live in milliseconds
  };
  authCheckInProgress: boolean;
}

interface AuthActions {
  // Google OAuth will handle login via redirect, so we mainly need these actions:
  getCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: (skipCache?: boolean) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  // Enhanced logout with redirect
  logoutAndRedirect: (redirectUrl?: string) => Promise<void>;
  initialize: () => Promise<void>;
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
        isHydrated: false,
        error: null,
        lastActivity: null,
        // Performance enhancements
        userCache: {
          data: null,
          timestamp: null,
          ttl: 5 * 60 * 1000, // 5 minutes cache
        },
        authCheckInProgress: false,

        // Actions
        getCurrentUser: async () => {
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });

            const user = await authService.getCurrentUser();
            
            set(state => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = Date.now();
            });
          } catch (error) {
            set(state => {
              state.isLoading = false;
              state.error = error instanceof AuthenticationError ? error.message : 'Failed to get user';
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

            await authService.logout();
            
            // Clear all state
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = null;
            });

            // Clear any OAuth parameters
            authService.clearOAuthParams();
            
          } catch {
            // Even if logout fails on server, clear local state
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = null;
            });
            
            // Clear any OAuth parameters
            authService.clearOAuthParams();
          }
        },

        logoutAndRedirect: async (redirectUrl = '/') => {
          const { isAuthenticated, user } = get();
          
          // Only proceed if user is authenticated
          if (!isAuthenticated || !user) {
            window.location.href = redirectUrl;
            return;
          }

          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // Call server logout (don't wait if it fails)
            try {
              await authService.logout();
            } catch {
              // Ignore server logout errors
            }
            
            // Clear all local state
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = null;
            });

            // Clear any OAuth parameters from URL
            authService.clearOAuthParams();
            
            // Redirect
            window.location.href = redirectUrl;
            
          } catch {
            // Ensure state is cleared even on error
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = null;
            });
            
            // Force redirect anyway
            window.location.href = redirectUrl;
          }
        },

        checkAuthStatus: async (skipCache = false) => {
          const state = get();
          
          // Prevent duplicate requests
          if (state.authCheckInProgress) {
            console.log('🔍 Auth check already in progress, skipping...');
            return;
          }
          
          // Skip check if already loading
          if (state.isLoading) {
            return;
          }
          
          // For OAuth callbacks, always skip cache
          const isOAuthCallback = window.location.pathname === '/auth/callback';
          const shouldSkipCache = skipCache || isOAuthCallback;
          
          // Check cache first (unless skipping cache)
          if (!shouldSkipCache && state.userCache.timestamp) {
            const cacheAge = Date.now() - state.userCache.timestamp;
            if (cacheAge < state.userCache.ttl && state.userCache.data) {
              console.log('🚀 Using cached user data (age:', Math.round(cacheAge / 1000), 'seconds)');
              set(state => {
                state.user = state.userCache.data;
                state.isAuthenticated = !!state.userCache.data;
                state.lastActivity = Date.now();
              });
              return;
            }
          }
          
          // Skip check if recently checked (unless forced or OAuth callback)
          if (!shouldSkipCache && state.lastActivity && Date.now() - state.lastActivity < 30000) {
            return;
          }
          
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Auth check timeout after 8 seconds'));
            }, 8000);
          });
          
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
              state.authCheckInProgress = true;
            });
            
            // Race between auth check and timeout
            const result = await Promise.race([
              authService.checkAuthStatus(),
              timeoutPromise
            ]) as { isAuthenticated: boolean; user?: User };
            
            const currentTime = Date.now();
            
            set(state => {
              state.user = result.user || null;
              state.isAuthenticated = result.isAuthenticated;
              state.isLoading = false;
              state.error = null;
              state.lastActivity = currentTime;
              state.authCheckInProgress = false;
              
              // Update cache with fresh data
              state.userCache = {
                data: result.user || null,
                timestamp: currentTime,
                ttl: state.userCache.ttl,
              };
            });
            
            console.log('✅ Auth check completed and cached');
          } catch (error) {
            // If auth check fails, user is not authenticated
            const currentTime = Date.now();
            
            set(state => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null; // Don't show error for failed auth check
              state.lastActivity = currentTime;
              state.authCheckInProgress = false;
              
              // Clear cache on auth failure
              state.userCache = {
                data: null,
                timestamp: currentTime,
                ttl: state.userCache.ttl,
              };
            });
            
            console.log('❌ Auth check failed, cache cleared');
            
            // Only throw if it's a real error, not auth failure
            if (error instanceof Error && !error.message.includes('not authenticated')) {
              throw error;
            }
          }
        },

        initialize: async () => {
          const state = get();
          
          // Skip if already initialized
          if (state.isHydrated) {
            return;
          }
          
          try {
            set(state => {
              state.isLoading = true;
              state.error = null;
            });
            
            await get().checkAuthStatus(true); // Force check on initialization
            
            set(state => {
              state.isHydrated = true;
              state.isLoading = false;
            });
                     } catch {
             set(state => {
               state.isHydrated = true;
               state.isLoading = false;
               state.error = null;
             });
           }
        },

        setUser: (user: User | null) => {
          set(state => {
            state.user = user;
            state.isAuthenticated = !!user;
            state.lastActivity = Date.now();
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
        version: 1,
        // Only persist user and auth status, not loading/error states or cache
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          lastActivity: state.lastActivity,
          // Don't persist cache data to avoid stale data issues
        }),
        // Add migration function for version updates
        migrate: (persistedState) => {
          return persistedState as AuthState;
        },
        // Handle rehydration
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error && state) {
              // Mark as hydrated after successful rehydration
              state.isHydrated = true;
            }
          };
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Optimized selectors for better performance
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAuthHydrated = () => useAuthStore(state => state.isHydrated);

// Actions
export const useAuthActions = () => useAuthStore(state => ({
  getCurrentUser: state.getCurrentUser,
  logout: state.logout,
  logoutAndRedirect: state.logoutAndRedirect,
  checkAuthStatus: state.checkAuthStatus,
  clearError: state.clearError,
  setLoading: state.setLoading,
  setUser: state.setUser,
  initialize: state.initialize,
})); 