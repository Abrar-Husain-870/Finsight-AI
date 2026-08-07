import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@finsight/shared';
import { PasswordField } from './PasswordField.js';
import { useAuthStore } from '../store/auth.store.js';
import { authApi } from '../api/auth.api.js';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils.js';
import { mapHttpError } from '../../../lib/errors.js';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';

export function RegisterForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useUnsavedChanges(isDirty, 'You have unsaved registration details.');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setSubmitError(null);
      const response = await authApi.register(data);
      setAuth(response.user, response.accessToken);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      const appError = mapHttpError(error);
      setSubmitError(appError.message);
      
      // Focus error summary
      setTimeout(() => document.getElementById('register-error')?.focus(), 0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <div 
          id="register-error"
          tabIndex={-1} 
          role="alert" 
          className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm font-medium text-[var(--color-danger)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
        >
          {submitError}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-primary)]">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name')}
          className={cn(
            "flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors",
            errors.name && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
          )}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-primary)]">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={cn(
            "flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors",
            errors.email && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
          )}
          placeholder="name@example.com"
        />
        {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-[var(--color-text-primary)]">
          Password
        </label>
        <PasswordField
          id="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-[var(--color-accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-1 disabled:opacity-70 transition-all"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
      </button>
    </form>
  );
}
