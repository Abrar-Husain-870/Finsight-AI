import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@finsight/shared';
import { PasswordField } from './PasswordField.js';
import { useAuthStore } from '../store/auth.store.js';
import { authApi } from '../api/auth.api.js';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';
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
          className="rounded-md bg-red-50 dark:bg-red-900/10 p-3 text-sm font-medium text-[var(--color-danger)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
        >
          {submitError}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-primary)] pl-1">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />
      </div>

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
          autoComplete="new-password"
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
        Create Account
      </Button>
    </form>
  );
}
