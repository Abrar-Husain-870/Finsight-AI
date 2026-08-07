import React, { useState, useMemo } from 'react';
import { useCategoryTree } from '../hooks/useCategories.js';
import { CategoryIcon } from './CategoryIcon.js';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils.js';
import { CategoryTreeNode } from '@finsight/shared';

interface CategoryPickerProps {
  value?: string;
  onChange: (categoryId: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CategoryPicker({ value, onChange, error, disabled }: CategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: tree, isLoading } = useCategoryTree();
  
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectedCategory = useMemo(() => {
    if (!tree || !value) return null;
    for (const parent of tree) {
      if (parent.id === value) return parent;
      const child = parent.children.find(c => c.id === value);
      if (child) return child;
    }
    return null;
  }, [tree, value]);

  const filteredTree = useMemo(() => {
    if (!tree) return [];
    if (!search) return tree;
    
    const lowerSearch = search.toLowerCase();
    return tree.map(parent => {
      const matchParent = parent.name.toLowerCase().includes(lowerSearch);
      const matchedChildren = parent.children.filter(c => 
        c.name.toLowerCase().includes(lowerSearch)
      );
      
      if (matchParent || matchedChildren.length > 0) {
        return {
          ...parent,
          children: matchParent ? parent.children : matchedChildren
        };
      }
      return null;
    }).filter((val): val is CategoryTreeNode => Boolean(val));
  }, [tree, search]);

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={!!error}
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors",
          error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading categories...</span>
          </div>
        ) : selectedCategory ? (
          <div className="flex items-center gap-2">
            <CategoryIcon name={selectedCategory.icon} className={cn("h-4 w-4 text-", selectedCategory.color)} colorClass="bg-transparent p-0" />
            <span className="text-[var(--color-text-primary)]">{selectedCategory.name}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-secondary)]">Select category...</span>
        )}
        <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-secondary)] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div 
          role="listbox"
          className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-lg animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="sticky top-0 bg-[var(--color-bg-primary)] p-2 border-b border-[var(--color-border-primary)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-sm bg-[var(--color-bg-secondary)] py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                aria-label="Search categories"
              />
            </div>
          </div>
          
          <div className="p-1">
            {filteredTree.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--color-text-secondary)]">
                No categories found.
              </div>
            ) : (
              filteredTree.map(parent => (
                <div key={parent.id} className="mb-2 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                    {parent.name}
                  </div>
                  {parent.children.map(child => (
                    <button
                      key={child.id}
                      type="button"
                      role="option"
                      aria-selected={value === child.id}
                      onClick={() => handleSelect(child.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:bg-[var(--color-bg-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
                        value === child.id && "bg-[var(--color-bg-secondary)] font-medium text-[var(--color-accent-primary)]"
                      )}
                    >
                      <CategoryIcon name={child.icon} className={cn("text-", child.color)} colorClass="bg-transparent p-0" />
                      <span>{child.name}</span>
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
