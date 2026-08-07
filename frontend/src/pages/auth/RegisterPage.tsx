import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../../features/auth/components/RegisterForm.js';
import { GoogleLoginButton } from '../../features/auth/components/GoogleLoginButton.js';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../lib/motion.js';

export default function RegisterPage() {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Create an account
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-text-primary)] hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <RegisterForm />

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
        <span className="bg-[var(--color-bg-primary)] px-4 text-xs font-medium text-[var(--color-text-secondary)]">
          OR
        </span>
        <div className="flex-1 border-t border-[var(--color-border-primary)]" />
      </div>

      <GoogleLoginButton />
      
      <p className="mt-8 text-center text-xs text-[var(--color-text-secondary)] leading-relaxed">
        By clicking continue, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</span> and{' '}
        <span className="underline cursor-pointer hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</span>.
      </p>
    </motion.div>
  );
}
