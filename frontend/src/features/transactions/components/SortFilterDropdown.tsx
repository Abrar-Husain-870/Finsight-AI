import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export interface SortOption {
  key: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'date_desc', label: 'Date: Newest First' },
  { key: 'date_asc', label: 'Date: Oldest First' },
  { key: 'amount_desc', label: 'Amount: Highest First' },
  { key: 'amount_asc', label: 'Amount: Lowest First' },
  { key: 'merchant_asc', label: 'Merchant: A to Z' },
  { key: 'merchant_desc', label: 'Merchant: Z to A' },
];

interface SortFilterDropdownProps {
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export function SortFilterDropdown({ value, onChange, className }: SortFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeOption = SORT_OPTIONS.find(opt => opt.key === value) ?? SORT_OPTIONS[0] ?? { key: 'date_desc', label: 'Date: Newest First' };

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        id="sort-filter-dropdown-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-lg)] border text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:border-transparent',
          'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
        <span className="truncate">{activeOption.label}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-200 ml-0.5 text-[var(--color-text-secondary)]', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(
            'absolute z-50 mt-2 w-56 overflow-hidden flex flex-col',
            'rounded-[var(--radius-xl)] border border-[var(--color-border-primary)]',
            'bg-[var(--color-bg-primary)] shadow-[var(--shadow-dropdown)]',
            'origin-top-left animate-in fade-in-0 zoom-in-95 duration-150',
            'left-0',
          )}
        >
          <div className="p-1.5 space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Sort By
            </div>

            {SORT_OPTIONS.map(option => {
              const isSelected = value === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.key)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] font-semibold'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
