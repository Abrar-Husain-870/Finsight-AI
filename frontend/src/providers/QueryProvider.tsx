import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AppError } from '../lib/errors.js';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof AppError) {
            // Do not retry client errors or validation errors
            if ([400, 401, 403, 404, 409, 422].includes(error.statusCode)) {
              return false;
            }
          }
          // Retry network errors or 5xx up to 2 times
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff max 30s
      },
      mutations: {
        retry: 0, // Never retry mutations automatically to prevent duplicate side effects
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
