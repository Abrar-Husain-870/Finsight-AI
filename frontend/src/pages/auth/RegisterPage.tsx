import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm.js';
import { GoogleLoginButton } from '../../features/auth/components/GoogleLoginButton.js';

export default function RegisterPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Create an account
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-accent-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <RegisterForm />

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
        <span className="bg-[var(--color-bg-primary)] px-4 text-xs text-[var(--color-text-secondary)] uppercase">
          Or continue with
        </span>
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
      </div>

      <GoogleLoginButton />
      
      <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
        By clicking continue, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-[var(--color-text-primary)]">Terms of Service</span> and{' '}
        <span className="underline cursor-pointer hover:text-[var(--color-text-primary)]">Privacy Policy</span>.
      </p>
    </div>
  );
}
