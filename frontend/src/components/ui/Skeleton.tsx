import React from 'react';
import { cn } from '../../lib/utils.js';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--color-border-primary)]/40", className)}
      {...props}
    />
  );
}
