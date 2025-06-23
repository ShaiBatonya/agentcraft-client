import { apiService, ApiError } from './api';
import type { User } from '@/types';
import { config } from '@/config/env';

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
   * OAuth redirects must go directly to backend - they cannot be proxied
   * 
   * Flow: Frontend → Backend OAuth → Google → Backend Callback → Frontend /auth/callback
   * Security: JWT tokens are stored in HttpOnly cookies, never exposed in URLs
   */
  getGoogleOAuthUrl(): string {
    // For OAuth, we must use the absolute backend URL since browser redirects
    // cannot go through frontend proxy rules
    const oauthUrl = `${config.backendUrl}/api/auth/google`;
    
    // Add state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    
    console.log('🔗 Initiating secure OAuth flow to:', oauthUrl);
    return `${oauthUrl}?state=${state}`;
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
   * Clean up OAuth state after successful authentication
   * Note: State verification is handled by the backend in our secure flow
   */
  cleanupOAuthState(): void {
    localStorage.removeItem('oauth_state');
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