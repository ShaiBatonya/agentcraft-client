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
    console.log('🔄 AuthService: Getting current user from API');
    try {
      const response = await apiService.auth.me();
      console.log('✅ AuthService: API response received', { success: response.success });
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: API call failed:', error);
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
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      console.error('Logout error:', error);
    }
  }

  /**
   * Check authentication status
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }> {
    console.log('🔄 AuthService: Checking authentication status');
    try {
      console.log('🔄 AuthService: Calling getCurrentUser');
      const user = await this.getCurrentUser();
      console.log('✅ AuthService: Authentication successful', { userId: user.id, email: user.email });
      return { isAuthenticated: true, user };
    } catch (error) {
      console.warn('⚠️ AuthService: Authentication failed:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Get Google OAuth URL
   */
  getGoogleOAuthUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    const oauthUrl = `${baseUrl}/api/auth/google`;
    console.log('🔍 AuthService: OAuth URL:', oauthUrl);
    return oauthUrl;
  }

  /**
   * Initiate Google OAuth login
   */
  initiateGoogleLogin(): void {
    window.location.href = this.getGoogleOAuthUrl();
  }

  /**
   * Check if current URL contains OAuth error parameters
   */
  getOAuthError(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('error');
  }

  /**
   * Clear OAuth parameters from URL
   */
  clearOAuthParams(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    url.searchParams.delete('auth');
    window.history.replaceState({}, document.title, url.pathname + url.search);
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