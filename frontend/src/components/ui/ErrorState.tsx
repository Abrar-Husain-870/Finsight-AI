import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils.js';
import { LucideIcon, AlertTriangle } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { staggerItemVariants } from '../../lib/motion.js';

interface ErrorStateProps extends HTMLMotionProps<"div"> {
  icon?: LucideIcon;
  title?: string;
  description: string;
  action?: React.ReactNode;
  referenceId?: string | undefined;
  onRetry?: () => void;
  autoRetrySeconds?: number;
}

export function ErrorState({ 
  icon: Icon = AlertTriangle, 
  title = "Something went wrong", 
  description, 
  action, 
  referenceId,
  onRetry,
  autoRetrySeconds,
  className, 
  ...props 
}: ErrorStateProps) {
  const [countdown, setCountdown] = useState(autoRetrySeconds || 0);

  useEffect(() => {
    if (countdown > 0 && onRetry) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && autoRetrySeconds && onRetry) {
      onRetry();
    }
    return undefined;
  }, [countdown, onRetry, autoRetrySeconds]);

  return (
    <motion.div
      variants={staggerItemVariants}
      initial="initial"
      animate="animate"
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-danger)]/50 bg-[var(--color-danger)]/5 p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)] mb-6 ring-1 ring-[var(--color-danger)]/30">
        <Icon className="h-8 w-8 text-[var(--color-danger)]" />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
      
      {referenceId && (
        <div className="mb-6 rounded-md bg-[var(--color-bg-secondary)] px-3 py-1.5 text-xs font-mono text-[var(--color-text-secondary)]">
          Ref: {referenceId}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {action && <div>{action}</div>}
        
        {onRetry && !action && (
          <button
            onClick={onRetry}
            className="rounded-md bg-[var(--color-danger)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-danger)]/90"
          >
            {countdown > 0 ? `Retrying in ${countdown}s...` : 'Try Again'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
