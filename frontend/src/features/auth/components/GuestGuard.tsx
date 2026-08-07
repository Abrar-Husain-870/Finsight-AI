import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { SessionLoader } from './SessionLoader.js';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isInitializing = useAuthStore(s => s.isInitializing);

  if (isInitializing) {
    return <SessionLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
