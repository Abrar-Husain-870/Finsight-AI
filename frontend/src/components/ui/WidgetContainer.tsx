import React from 'react';
import { cn } from '../../lib/utils.js';
import { Card } from './Card.js';

interface WidgetContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function WidgetContainer({ title, children, className, action }: WidgetContainerProps) {
  return (
    <Card noPadding className={cn("flex flex-col overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-[var(--color-border-primary)] px-6 py-4 bg-[var(--color-bg-primary)]">
        <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 p-6">
        {children}
      </div>
    </Card>
  );
}
