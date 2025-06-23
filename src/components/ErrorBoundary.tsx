import React, { Component, ErrorInfo, ReactNode } from 'react';
import { showToast } from '@/stores/toast.store';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

// Error reporting service (mock implementation)
const reportError = async (error: Error, errorInfo: ErrorInfo, errorId: string) => {
  const errorReport = {
    id: errorId,
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || 'anonymous',
  };

  if (import.meta.env.DEV) {
    console.group('🚨 Error Boundary Report');
    console.error('Error Report:', errorReport);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.groupEnd();
  }

  // In production, you would send this to your error reporting service
  // Example: Sentry, LogRocket, Bugsnag, etc.
  try {
    if (import.meta.env.PROD) {
      // Example API call to error reporting service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    }
  } catch (reportingError) {
    console.warn('Failed to report error:', reportingError);
  }
};

// Generate unique error ID
const generateErrorId = () => {
  return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Extract meaningful error message
const getErrorMessage = (error: Error): string => {
  if (error.message.includes('ChunkLoadError')) {
    return 'Failed to load application resources. Please refresh the page.';
  }
  
  if (error.message.includes('Loading chunk')) {
    return 'Application update detected. Please refresh the page.';
  }
  
  if (error.message.includes('NetworkError')) {
    return 'Network connection error. Please check your internet connection.';
  }
  
  if (error.name === 'TypeError' && error.message.includes('Cannot read properties')) {
    return 'A component encountered unexpected data. Please try again.';
  }
  
  return error.message || 'An unexpected error occurred';
};

// Get error severity level
const getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
  if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
    return 'medium';
  }
  
  if (error.message.includes('NetworkError')) {
    return 'high';
  }
  
  if (error.name === 'TypeError') {
    return 'medium';
  }
  
  if (error.stack?.includes('react-dom')) {
    return 'high';
  }
  
  return 'medium';
};

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;
  
  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || generateErrorId();
    
    this.setState({
      errorInfo,
      errorId,
    });

    // Report error asynchronously
    reportError(error, errorInfo, errorId);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Show user-friendly toast notification
    const errorMessage = getErrorMessage(error);
    const severity = getErrorSeverity(error);
    
    if (severity === 'critical' || severity === 'high') {
      showToast.error(errorMessage, { duration: 8000, emoji: '🚨' });
    } else {
      showToast.error(errorMessage, { duration: 6000, emoji: '⚠️' });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Auto-reset on props change if enabled
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }

    // Reset on specific key changes
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, idx) => prevProps.resetKeys![idx] !== key
      );
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: this.state.retryCount + 1,
    });

    showToast.success('Component reset successfully! 🔄', { duration: 3000 });
  };

  handleRetry = () => {
    const { retryCount } = this.state;
    
    // Limit retry attempts
    if (retryCount >= 3) {
      showToast.error('Maximum retry attempts reached. Please refresh the page.', {
        duration: 8000,
        emoji: '🔄'
      });
      return;
    }

    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportIssue = () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (!error || !errorInfo || !errorId) return;

    const subject = encodeURIComponent(`Bug Report: ${getErrorMessage(error)}`);
    const body = encodeURIComponent(`
Error ID: ${errorId}
Error Message: ${error.message}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Error Stack:
${error.stack}

Component Stack:
${errorInfo.componentStack}

Steps to reproduce:
1. 
2. 
3. 

Expected behavior:


Actual behavior:

    `);

    const mailtoUrl = `mailto:support@agentcraft.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, enableRetry = true } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      const errorMessage = getErrorMessage(error);
      const severity = getErrorSeverity(error);
      const canRetry = enableRetry && retryCount < 3;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-4">
          <div className="max-w-md w-full">
            <div className="glass-card p-8 text-center space-y-6">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Content */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">
                  {severity === 'critical' ? 'Critical Error' : 'Something went wrong'}
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  {errorMessage}
                </p>

                {import.meta.env.DEV && (
                  <details className="text-left">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      Technical Details
                    </summary>
                    <div className="mt-2 p-3 bg-black/30 rounded-lg text-xs text-gray-400 font-mono break-all">
                      <div className="mb-2">
                        <strong>Error:</strong> {error.name}
                      </div>
                      <div className="mb-2">
                        <strong>Message:</strong> {error.message}
                      </div>
                      {this.state.errorId && (
                        <div>
                          <strong>ID:</strong> {this.state.errorId}
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {canRetry && (
                  <button
                    onClick={this.handleRetry}
                    className="w-full btn-primary"
                    disabled={retryCount >= 3}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again {retryCount > 0 && `(${3 - retryCount} attempts left)`}
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={this.handleReload}
                    className="flex-1 btn-secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reload Page
                  </button>

                  <button
                    onClick={this.handleReportIssue}
                    className="flex-1 btn-secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Report Issue
                  </button>
                </div>
              </div>

              {/* Helpful Links */}
              <div className="text-sm text-gray-400 space-y-2">
                <p>If the problem persists:</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="/support"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary; 