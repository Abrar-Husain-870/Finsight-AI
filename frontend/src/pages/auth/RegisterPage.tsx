import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { authApi } from '../../features/auth/api/auth.api.js';
import { mapHttpError } from '../../lib/errors.js';
import { toast } from 'sonner';
import GamingLogin from '../../components/ui/gaming-login.js';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authApi.register({ name, email, password });
      setAuth(data.user, data.accessToken);
      toast.success('Account created successfully! Welcome to FinSight.');
      navigate('/');
    } catch (err: unknown) {
      const appError = mapHttpError(err);
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authApi.demoLogin();
      setAuth(data.user, data.accessToken);
      toast.success('Welcome to FinSight Demo!');
      navigate('/');
    } catch (err: unknown) {
      const appError = mapHttpError(err);
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Video from src/Public/signin_page_loop_vid.mp4 */}
      <GamingLogin.VideoBackground />

      {/* Centered Register Card */}
      <div className="relative z-20 w-full max-w-md animate-fadeIn">
        <GamingLogin.RegisterForm 
          onSubmit={handleRegisterSubmit} 
          onDemoLogin={handleDemoLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/70 font-medium z-20">
        © {new Date().getFullYear()} FinSight. All rights reserved. Bank-grade privacy & local encryption.
      </footer>
    </div>
  );
}
