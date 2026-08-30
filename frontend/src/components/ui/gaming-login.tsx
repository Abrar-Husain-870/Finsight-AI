'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome, UserCheck, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils.js';
import { useTheme } from '../../providers/ThemeProvider.js';
import loopVideo from '../../Public/signin_page_loop_vid.mp4';

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => Promise<void>;
  onDemoLogin?: () => Promise<void>;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface VideoBackgroundProps {
  videoUrl?: string;
}

interface FormInputProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

// FormInput Component with Warm Sand tokens
export const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/20 transition-all font-medium text-sm"
      />
    </div>
  );
};

// ToggleSwitch Component
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <div className="relative inline-block w-9 h-5 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={cn(
        "absolute inset-0 rounded-full transition-colors duration-200 ease-in-out border border-[var(--color-border-primary)]",
        checked ? "bg-[var(--color-text-primary)]" : "bg-[var(--color-bg-tertiary)]"
      )}>
        <div className={cn(
          "absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-[var(--color-bg-primary)] transition-transform duration-200 ease-in-out shadow-xs",
          checked ? "transform translate-x-4" : ""
        )} />
      </div>
    </div>
  );
};

// VideoBackground Component
export const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl = loopVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/30 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto opacity-100"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Main LoginForm Component integrated with FinSight Theme & Auth Flow
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onDemoLogin, onGoogleLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, remember);
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-[var(--color-bg-primary)]/90 border border-[var(--color-border-primary)] shadow-2xl text-[var(--color-text-primary)]">
      {/* Header / Brand Title & Theme Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-base shadow-xs">
            F
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[var(--color-text-primary)]">FinSight</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]"
          aria-label="Toggle theme"
        >
          <span className="sr-only">Toggle theme</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="mb-6 text-left space-y-1">
        <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Welcome back</h3>
        <p className="text-xs text-[var(--color-text-secondary)] font-normal">
          Sign in to access your personal financial workspace
        </p>
      </div>

      {/* Submit Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/30 text-xs font-medium text-[var(--color-danger)] text-center">
          {error}
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          icon={<Mail size={18} />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <FormInput
            icon={<Lock size={18} />}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-none transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <div onClick={() => setRemember(!remember)} className="cursor-pointer">
              <ToggleSwitch
                checked={remember}
                onChange={() => setRemember(!remember)}
                id="remember-me"
              />
            </div>
            <label
              htmlFor="remember-me"
              className="text-xs text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text-primary)] transition-colors font-medium"
              onClick={() => setRemember(!remember)}
            >
              Remember me
            </label>
          </div>
          <a href="#" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-medium">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-[var(--color-bg-primary)] bg-[var(--color-text-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Quick Access / Demo Access */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[var(--color-border-primary)] absolute w-full" />
          <div className="bg-[var(--color-bg-primary)] px-3 relative text-[var(--color-text-secondary)] text-xs">
            or quick access via
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {onDemoLogin && (
            <button
              type="button"
              onClick={onDemoLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all cursor-pointer shadow-xs"
            >
              <UserCheck size={16} />
              <span>Demo Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoogleLogin ? onGoogleLogin : () => {
              window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/google`;
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all cursor-pointer shadow-xs"
          >
            <Chrome size={16} />
            <span>Google</span>
          </button>
        </div>
      </div>

      {/* Register Link */}
      <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-semibold text-[var(--color-text-primary)] hover:underline transition-colors">
          Create Account
        </a>
      </p>
    </div>
  );
};

const GamingLogin = {
  LoginForm,
  VideoBackground,
};

export default GamingLogin;
