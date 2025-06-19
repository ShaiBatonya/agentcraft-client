import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  getErrorType = (error?: Error): string => {
    if (!error) return 'Unknown Error';
    
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'Network Error';
    }
    if (error.message.includes('API') || error.message.includes('fetch')) {
      return 'API Error';
    }
    if (error.message.includes('React') || error.message.includes('Component')) {
      return 'Component Error';
    }
    return 'Application Error';
  };

  getErrorSolution = (error?: Error): string => {
    if (!error) return 'Please try refreshing the page.';
    
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'This might be due to a network issue. Please check your connection and try again.';
    }
    if (error.message.includes('API') || error.message.includes('fetch')) {
      return 'We\'re having trouble connecting to our servers. Please try again in a moment.';
    }
    return 'An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorType = this.getErrorType(this.state.error);
      const errorSolution = this.getErrorSolution(this.state.error);
      const canRetry = this.state.retryCount < 3;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
          <div className="w-full max-w-lg mx-auto">
            <div className="error-container p-8 space-y-6">
              {/* Error Icon */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-white mb-2">
                  {errorType}
                </h1>
                <p className="error-text text-sm leading-relaxed">
                  {errorSolution}
                </p>
              </div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-white/60 hover:text-white/80 transition-colors">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/10">
                    <p className="text-red-400 font-mono text-xs mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-white/60 text-xs overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {canRetry && (
                  <button
                    onClick={this.handleRetry}
                    className="w-full btn-primary text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                )}
                
                <button
                  onClick={this.handleReload}
                  className="w-full btn-secondary text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload Application
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full text-white/60 hover:text-white/80 transition-colors text-sm py-2"
                >
                  ← Go Back
                </button>
              </div>

              {/* Support Link */}
              <div className="text-center text-xs text-white/40">
                <p>
                  Need help? Contact{' '}
                  <a 
                    href="mailto:support@agentcraft.ai" 
                    className="text-accent-400 hover:text-accent-300 transition-colors"
                  >
                    support@agentcraft.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 