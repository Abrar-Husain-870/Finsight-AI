import React from 'react';
import { cn } from '../../lib/utils.js';
import { Card } from './Card.js';

interface WidgetContainerProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function WidgetContainer({ title, subtitle, badge, children, className, action }: WidgetContainerProps) {
  return (
    <Card noPadding className={cn("flex flex-col overflow-hidden h-full", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 pt-5 sm:pt-6 pb-2 gap-2 bg-transparent shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-secondary)] font-normal leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-8 pb-6 sm:pb-7 pt-2 overflow-visible">
        {children}
      </div>
    </Card>
  );
}
