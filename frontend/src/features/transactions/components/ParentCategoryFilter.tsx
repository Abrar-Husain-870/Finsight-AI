import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { ChevronDown, Folder, X, Check } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface ParentCategoryFilterProps {
  value?: string | undefined;
  onChange: (parentCategoryId: string | undefined) => void;
  className?: string | undefined;
}

export function ParentCategoryFilter({ value, onChange, className }: ParentCategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: tree, isLoading } = useCategoryTree();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  const selectedCategory = useMemo(() => {
    if (!tree || !value) return null;
    return tree.find(p => p.id === value) || null;
  }, [tree, value]);

  const handleSelect = (categoryId: string | undefined) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        id="parent-category-filter-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-lg)] border text-sm font-medium transition-all duration-150 whitespace-nowrap',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:border-transparent',
          value
            ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] font-semibold'
            : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCategory ? (
          <div className="flex items-center gap-1.5 max-w-[150px] truncate">
            <CategoryIcon name={selectedCategory.icon} className="h-3.5 w-3.5 shrink-0" colorClass="bg-transparent p-0" />
            <span className="truncate">{selectedCategory.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Folder className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Category</span>
          </div>
        )}

        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear category filter"
            onClick={handleClear}
            onKeyDown={e => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--color-accent-muted)] transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </span>
        ) : (
          <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu */}
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
              Category
            </div>

            {/* All Categories Option */}
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect(undefined)}
              className={cn(
                'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-2 text-xs font-medium transition-colors',
                !value
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
              )}
            >
              <span>All Categories</span>
              {!value && <Check className="h-3.5 w-3.5" />}
            </button>

            {tree?.map(parent => (
              <button
                key={parent.id}
                type="button"
                role="option"
                aria-selected={value === parent.id}
                onClick={() => handleSelect(parent.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-2 text-xs font-medium transition-colors',
                  value === parent.id
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] font-semibold'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
                )}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon name={parent.icon} className="h-3.5 w-3.5" colorClass="bg-transparent p-0" />
                  <span>{parent.name}</span>
                </div>
                {value === parent.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
