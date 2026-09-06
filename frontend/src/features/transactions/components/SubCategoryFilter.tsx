import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { ChevronDown, Tag, X, Check } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface SubCategoryFilterProps {
  parentCategoryId?: string | undefined;
  value?: string | undefined;
  onChange: (subCategoryId: string | undefined) => void;
  className?: string | undefined;
}

export function SubCategoryFilter({ parentCategoryId, value, onChange, className }: SubCategoryFilterProps) {
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

  // Available subcategories based on parentCategoryId
  const availableSubcategories = useMemo(() => {
    if (!tree) return [];
    if (parentCategoryId) {
      const parent = tree.find(p => p.id === parentCategoryId);
      return parent ? parent.children.map(c => ({ ...c, parentName: parent.name })) : [];
    }
    // If no parent selected, combine all subcategories
    return tree.flatMap(parent =>
      parent.children.map(child => ({ ...child, parentName: parent.name }))
    );
  }, [tree, parentCategoryId]);

  // Find selected subcategory
  const selectedSubCategory = useMemo(() => {
    if (!value || availableSubcategories.length === 0) return null;
    return availableSubcategories.find(c => c.id === value) || null;
  }, [availableSubcategories, value]);

  const handleSelect = (subCategoryId: string | undefined) => {
    onChange(subCategoryId);
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
        id="sub-category-filter-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        disabled={isLoading || availableSubcategories.length === 0}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-lg)] border text-sm font-medium transition-all duration-150 whitespace-nowrap',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:border-transparent',
          value
            ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] font-semibold'
            : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
          (isLoading || availableSubcategories.length === 0) && 'opacity-50 cursor-not-allowed',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedSubCategory ? (
          <div className="flex items-center gap-1.5 max-w-[150px] truncate">
            <CategoryIcon name={selectedSubCategory.icon} className="h-3.5 w-3.5 shrink-0" colorClass="bg-transparent p-0" />
            <span className="truncate">{selectedSubCategory.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Sub-Category</span>
          </div>
        )}

        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear sub-category filter"
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
            'absolute z-50 mt-2 w-56 max-h-72 overflow-y-auto flex flex-col',
            'rounded-[var(--radius-xl)] border border-[var(--color-border-primary)]',
            'bg-[var(--color-bg-primary)] shadow-[var(--shadow-dropdown)]',
            'origin-top-left animate-in fade-in-0 zoom-in-95 duration-150',
            'left-0',
          )}
        >
          <div className="p-1.5 space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {parentCategoryId ? 'Sub-Category' : 'All Sub-Categories'}
            </div>

            {/* All Subcategories Option */}
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
              <span>All Sub-Categories</span>
              {!value && <Check className="h-3.5 w-3.5" />}
            </button>

            {availableSubcategories.map(child => (
              <button
                key={child.id}
                type="button"
                role="option"
                aria-selected={value === child.id}
                onClick={() => handleSelect(child.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-2 text-xs font-medium transition-colors',
                  value === child.id
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] font-semibold'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
                )}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon name={child.icon} className="h-3.5 w-3.5" colorClass="bg-transparent p-0" />
                  <span>{child.name}</span>
                </div>
                {value === child.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
