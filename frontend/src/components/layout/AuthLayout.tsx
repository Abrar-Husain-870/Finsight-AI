import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      {/* Brand Section - Hidden on mobile */}
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--color-accent-primary)] p-12 text-[var(--color-bg-primary)] lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[var(--color-bg-primary)]" />
            <span className="text-xl font-bold tracking-tight">FinSight</span>
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Financial intelligence, redefined.
          </h1>
          <p className="text-lg opacity-80">
            Take complete control of your wealth with institutional-grade analytics and seamless account integration.
          </p>
        </div>
        <div className="text-sm opacity-60">
          © {new Date().getFullYear()} FinSight Inc. All rights reserved.
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-[var(--color-accent-primary)]" />
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FinSight</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
