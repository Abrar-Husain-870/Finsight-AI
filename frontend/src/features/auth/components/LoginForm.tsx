import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@finsight/shared';
import { PasswordField } from './PasswordField.js';
import { useAuthStore } from '../store/auth.store.js';
import { authApi } from '../api/auth.api.js';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';
import { mapHttpError } from '../../../lib/errors.js';

export function LoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setSubmitError(null);
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      toast.success('Welcome back!');
    } catch (error: unknown) {
      const appError = mapHttpError(error);
      setSubmitError(appError.message);
      setTimeout(() => document.getElementById('login-error')?.focus(), 0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <div 
          id="login-error"
          tabIndex={-1} 
          role="alert" 
          className="rounded-md bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 p-3 text-sm font-medium text-[var(--color-danger)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
        >
          {submitError}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)] pl-1">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)] pl-1">
          Password
        </label>
        <PasswordField
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full mt-2"
        size="lg"
      >
        Sign In
      </Button>
    </form>
  );
}
