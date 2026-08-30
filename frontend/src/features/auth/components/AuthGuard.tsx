import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { SessionLoader } from './SessionLoader.js';
import { ErrorState } from '../../../components/ui/ErrorState.js';
import { LogIn } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, isSessionExpired, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (isInitializing) {
    return <SessionLoader />;
  }

  if (isSessionExpired) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6">
        <ErrorState
          icon={LogIn}
          title="Session Expired"
          description="For your security, your session has expired due to inactivity. Please log in again to continue."
          action={
            <button
              onClick={() => {
                clearAuth(); // Clear the expired flag
                navigate('/login', { state: { from: location } });
              }}
              className="rounded-md bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-[var(--color-accent-primary-foreground)] transition-colors hover:opacity-90"
            >
              Log In Again
            </button>
          }
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
