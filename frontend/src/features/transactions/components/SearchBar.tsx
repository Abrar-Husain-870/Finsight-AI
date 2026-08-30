import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative w-full max-w-sm", className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        <input
          ref={ref}
          type="text"
          className="flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] pl-10 pr-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all placeholder:text-[var(--color-text-secondary)] shadow-sm"
          placeholder="Search merchants, descriptions..."
          {...props}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center rounded border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          /
        </div>
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
