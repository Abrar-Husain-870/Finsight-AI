import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm.js';
import { GoogleLoginButton } from '../../features/auth/components/GoogleLoginButton.js';
import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { authApi } from '../../features/auth/api/auth.api.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      const data = await authApi.demoLogin();
      setAuth(data.user, data.accessToken);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Welcome back
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[var(--color-accent-primary)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <LoginForm />

      <button 
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="mt-4 w-full flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Login as Demo User'}
      </button>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
        <span className="bg-[var(--color-bg-primary)] px-4 text-xs text-[var(--color-text-secondary)] uppercase">
          Or continue with
        </span>
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
      </div>

      <GoogleLoginButton />
    </div>
  );
}
