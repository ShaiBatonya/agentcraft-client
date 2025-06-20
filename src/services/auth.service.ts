import { apiService, ApiError } from './api';
import type { User } from '@/types';

/**
 * Authentication Service
 * Provides clean abstraction for authentication operations
 * Following Single Responsibility Principle
 */
export class AuthService {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.auth.me();
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new AuthenticationError('User not authenticated');
      }
      throw new AuthenticationError('Failed to get current user');
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiService.auth.logout();
          } catch {
        // Don't throw - logout should always succeed locally
      }
  }

  /**
   * Check authentication status with enhanced debugging
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      const user = await this.getCurrentUser();
      return { isAuthenticated: true, user };
          } catch {
        return { isAuthenticated: false };
      }
  }

  /**
   * Get Google OAuth URL with proper callback
   */
  getGoogleOAuthUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    
    // Ensure we have the correct callback URL
    const currentOrigin = window.location.origin;
    const callbackUrl = `${currentOrigin}/auth/callback`;
    
    // Add state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    
    const oauthUrl = `${baseUrl}/api/auth/google?callback=${encodeURIComponent(callbackUrl)}&state=${state}`;
    
    return oauthUrl;
  }

  /**
   * Initiate Google OAuth login
   */
  initiateGoogleLogin(): void {
    const oauthUrl = this.getGoogleOAuthUrl();
    window.location.href = oauthUrl;
  }

  /**
   * Check if current URL contains OAuth error parameters
   */
  getOAuthError(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('error');
  }

  /**
   * Verify OAuth state for security
   */
  verifyOAuthState(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const returnedState = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    
    if (!returnedState || !storedState) {
      return false;
    }
    
    const isValid = returnedState === storedState;
    
    // Clean up stored state
    if (isValid) {
      localStorage.removeItem('oauth_state');
    }
    
    return isValid;
  }

  /**
   * Enhanced OAuth callback detection
   */
  isOAuthCallback(): boolean {
    return window.location.pathname === '/auth/callback';
  }

  /**
   * Clear OAuth parameters from URL with enhanced cleaning
   */
  clearOAuthParams(): void {
    const url = new URL(window.location.href);
    const hadParams = url.searchParams.has('error') || 
                     url.searchParams.has('auth') || 
                     url.searchParams.has('code') ||
                     url.searchParams.has('state');
    
    if (hadParams) {
      const paramsToRemove = ['error', 'auth', 'code', 'state', 'scope'];
      
      paramsToRemove.forEach(param => {
        url.searchParams.delete(param);
      });
      
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }

  /**
   * Check auth health
   */
  async healthCheck(): Promise<{ authenticated: boolean; status: string }> {
    try {
      const response = await apiService.auth.health();
      return {
        authenticated: response.data.authenticated,
        status: 'online'
      };
          } catch {
        return {
          authenticated: false,
          status: 'offline'
        };
      }
  }
}

/**
 * Custom authentication error class
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Export singleton instance
export const authService = new AuthService(); 