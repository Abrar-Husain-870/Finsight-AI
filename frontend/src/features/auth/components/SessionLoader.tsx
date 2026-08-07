import React from 'react';
import { Loader2 } from 'lucide-react';

export function SessionLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="flex flex-col items-center gap-4 text-[var(--color-text-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );
}
