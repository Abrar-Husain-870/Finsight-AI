import React from 'react';
import { cn } from '../../lib/utils.js';
import { LucideIcon } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { staggerItemVariants } from '../../lib/motion.js';

interface EmptyStateProps extends HTMLMotionProps<"div"> {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className, ...props }: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      initial="initial"
      animate="animate"
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/30 p-8 text-center",
        className
      )}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-ai-bg)] mb-6 shadow-sm ring-1 ring-[var(--color-ai-muted)]">
        <Icon className="h-10 w-10 text-[var(--color-ai-accent)]" />
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
      <p className="mb-8 max-w-md text-base text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {action && <div>{action}</div>}
        {secondaryAction && <div>{secondaryAction}</div>}
      </div>
    </motion.div>
  );
}
