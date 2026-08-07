import React from 'react';
import { cn } from '../../lib/utils.js';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { springConfig } from '../../lib/motion.js';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-secondary)] shadow-sm border border-transparent',
      secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-primary)] border border-transparent',
      outline: 'border border-[var(--color-border-primary)] bg-transparent hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
      ghost: 'bg-transparent hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-transparent',
      danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 shadow-sm border border-transparent',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs tracking-wide',
      md: 'h-10 px-6 py-2 text-sm tracking-tight',
      lg: 'h-12 px-10 text-base tracking-tight',
      icon: 'h-10 w-10 justify-center',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={springConfig}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] disabled:pointer-events-none disabled:opacity-40',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children as React.ReactNode}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
