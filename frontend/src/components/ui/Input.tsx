import React from 'react';
import { cn } from '../../lib/utils.js';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface InputProps extends HTMLMotionProps<"input"> {
  error?: string | undefined;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              {icon}
            </div>
          )}
          <motion.input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-4 py-2 text-[15px] text-[var(--color-text-primary)] transition-all duration-200",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-[var(--color-text-secondary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
              icon && "pl-11",
              error && "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)] bg-red-50 dark:bg-red-900/10",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            id={`${props.id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs font-medium text-[var(--color-danger)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
