import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { ChevronDown, Tag, X, Check, Search } from 'lucide-react';
import { cn } from '../../../lib/utils.js';
import { CategoryTreeNode } from '@finsight/shared';

interface CategoryFilterProps {
  value?: string | undefined;
  onChange: (categoryId: string | undefined) => void;
  className?: string | undefined;
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: tree, isLoading } = useCategoryTree();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Find currently selected category
  const selectedCategory = useMemo(() => {
    if (!tree || !value) return null;
    for (const parent of tree) {
      if (parent.id === value) return parent;
      const child = parent.children.find(c => c.id === value);
      if (child) return { ...child, parentName: parent.name };
    }
    return null;
  }, [tree, value]);

  // Filter tree based on search query
  const filteredTree = useMemo(() => {
    if (!tree) return [];
    if (!search.trim()) return tree;

    const query = search.toLowerCase().trim();
    return tree.map(parent => {
      const parentMatch = parent.name.toLowerCase().includes(query);
      const matchingChildren = parent.children.filter(c =>
        c.name.toLowerCase().includes(query)
      );

      if (parentMatch || matchingChildren.length > 0) {
        return {
          ...parent,
          children: parentMatch ? parent.children : matchingChildren
        };
      }
      return null;
    }).filter((node): node is CategoryTreeNode => Boolean(node));
  }, [tree, search]);

  const handleSelect = (categoryId: string | undefined) => {
    onChange(categoryId);
    setIsOpen(false);
    setSearch('');
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
        id="category-filter-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-lg)] border text-sm font-medium transition-all duration-150 whitespace-nowrap',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:border-transparent',
          value
            ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
            : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCategory ? (
          <div className="flex items-center gap-1.5 max-w-[160px] truncate">
            <CategoryIcon name={selectedCategory.icon} className="h-3.5 w-3.5 shrink-0" colorClass="bg-transparent p-0" />
            <span className="truncate">{selectedCategory.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
            'absolute z-50 mt-2 w-64 max-h-80 overflow-hidden flex flex-col',
            'rounded-[var(--radius-xl)] border border-[var(--color-border-primary)]',
            'bg-[var(--color-bg-primary)] shadow-[var(--shadow-dropdown)]',
            'origin-top-left animate-in fade-in-0 zoom-in-95 duration-150',
            'left-0',
          )}
        >
          {/* Search Bar inside Dropdown */}
          <div className="p-2 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-[var(--color-text-muted)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
              />
            </div>
          </div>

          {/* Category List */}
          <div className="overflow-y-auto p-1.5 flex-1 space-y-1.5">
            {/* All Categories Option */}
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect(undefined)}
              className={cn(
                'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs font-medium transition-colors',
                !value
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
              )}
            >
              <span>All Categories</span>
              {!value && <Check className="h-3.5 w-3.5" />}
            </button>

            {filteredTree.length === 0 ? (
              <div className="py-4 text-center text-xs text-[var(--color-text-muted)]">
                No categories match your search.
              </div>
            ) : (
              filteredTree.map(parent => (
                <div key={parent.id} className="space-y-0.5">
                  {/* Parent Group Header / Option */}
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === parent.id}
                    onClick={() => handleSelect(parent.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-1 text-xs font-semibold tracking-wide uppercase transition-colors',
                      value === parent.id
                        ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <CategoryIcon name={parent.icon} className="h-3.5 w-3.5" colorClass="bg-transparent p-0" />
                      <span>{parent.name}</span>
                    </div>
                    {value === parent.id && <Check className="h-3.5 w-3.5" />}
                  </button>

                  {/* Subcategories */}
                  {parent.children.map(child => (
                    <button
                      key={child.id}
                      type="button"
                      role="option"
                      aria-selected={value === child.id}
                      onClick={() => handleSelect(child.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-[var(--radius-md)] pl-6 pr-2.5 py-1.5 text-xs transition-colors',
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
