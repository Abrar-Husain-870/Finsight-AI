import React from 'react';
import { AuthProvider } from './AuthProvider.js';
import { ThemeProvider } from './ThemeProvider.js';
import { QueryProvider } from './QueryProvider.js';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '../components/ErrorBoundary.js';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="system">
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </QueryProvider>
      </ThemeProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}
