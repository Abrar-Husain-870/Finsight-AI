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
      <div className="flex items-center justify-between px-8 pt-8 pb-2 bg-transparent">
        <h3 className="text-lg font-medium tracking-tight text-[var(--color-text-primary)]">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 px-8 pb-8 pt-2">
        {children}
      </div>
    </Card>
  );
}
