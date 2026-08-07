import React from 'react';
import { cn } from '../../lib/utils.js';
import { Card } from './Card.js';
import { Skeleton } from './Skeleton.js';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  iconColorClass?: string;
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({ title, value, trend, icon: Icon, iconColorClass, className, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("flex flex-col", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </Card>
    );
  }

  return (
    <Card hoverable className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</h3>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]", iconColorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{value}</span>
        {trend && (
          <div className="flex items-center text-xs">
            <span className={cn("font-medium", trend.isPositive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="ml-2 text-[var(--color-text-secondary)]">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
