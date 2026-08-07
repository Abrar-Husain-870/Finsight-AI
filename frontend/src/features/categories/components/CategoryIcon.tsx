import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface CategoryIconProps {
  name: string;
  className?: string;
  colorClass?: string;
}

export function CategoryIcon({ name, className, colorClass }: CategoryIconProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[name] || LucideIcons.HelpCircle;
  
  return (
    <div className={cn("flex items-center justify-center rounded-md p-2 bg-[var(--color-bg-secondary)]", colorClass)}>
      <Icon className={cn("h-4 w-4", className)} />
    </div>
  );
}
