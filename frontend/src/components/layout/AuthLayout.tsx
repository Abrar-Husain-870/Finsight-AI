import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-success)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-warning)]/5 blur-[120px] pointer-events-none" />

      {/* Centered Form Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-12 sm:px-10 flex flex-col">
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--color-accent-primary)] shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FinSight</span>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-primary)] sm:rounded-[var(--radius-2xl)] sm:shadow-[var(--shadow-dropdown)] sm:p-10 border border-transparent sm:border-[var(--color-border-primary)]">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}
