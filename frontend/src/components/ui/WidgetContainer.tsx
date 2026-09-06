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
    <Card noPadding className={cn("flex flex-col overflow-hidden h-full", className)}>
      <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-2 bg-transparent shrink-0">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-8 pb-6 sm:pb-8 pt-2 overflow-visible">
        {children}
      </div>
    </Card>
  );
}
