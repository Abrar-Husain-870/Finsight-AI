import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ui/ErrorState.js';
import { AppError } from '../lib/errors.js';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isAppError = error instanceof AppError;
      const title = isAppError && error.statusCode === 404 ? 'Page Not Found' : 'Something went wrong';
      const description = isAppError 
        ? error.message 
        : 'An unexpected error occurred in the application. Our team has been notified.';
      const referenceId = isAppError ? error.referenceId : undefined;

      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6">
          <ErrorState 
            title={title}
            description={description}
            referenceId={referenceId}
            onRetry={() => window.location.assign('/')}
            action={
              <button
                onClick={() => window.location.assign('/')}
                className="rounded-md bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg-primary)] transition-colors hover:opacity-90"
              >
                Return to Dashboard
              </button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
