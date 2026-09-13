import React from 'react';
import { TransactionResponse } from '@finsight/shared';
import { TransactionRow } from './TransactionRow.js';
import { FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { EmptyState } from '../../../components/ui/EmptyState.js';

interface TransactionTableProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
  onEdit: (tx: TransactionResponse) => void;
  onDelete: (tx: TransactionResponse) => void;
  selectedIds?: string[] | undefined;
  onToggleSelect?: ((id: string) => void) | undefined;
  onToggleSelectAll?: (() => void) | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  onSortChange?: ((field: 'date' | 'amount' | 'merchant') => void) | undefined;
}

export const TransactionTable = React.memo(function TransactionTable({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  sortBy = 'date',
  sortOrder = 'desc',
  onSortChange
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="w-full flex flex-col space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center animate-pulse">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded-md"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-32"></div>
                <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-20"></div>
              </div>
            </div>
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <EmptyState 
          icon={FileText}
          title="No transactions found"
          description="Get started by creating a new transaction, or adjust your filters to see more results."
        />
      </div>
    );
  }

  const allSelectedOnPage = transactions.length > 0 && transactions.every(t => selectedIds.includes(t.id));
  const isIndeterminate = transactions.some(t => selectedIds.includes(t.id)) && !allSelectedOnPage;

  const renderSortIcon = (field: 'date' | 'amount' | 'merchant') => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-[var(--chart-2)]" /> : <ArrowDown className="h-3 w-3 text-[var(--chart-2)]" />;
  };

  return (
    <div className="w-full flex flex-col">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-[2fr_1fr_100px_1.5fr_1fr_75px] gap-4 px-5 py-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider items-center select-none">
        <div className="flex items-center gap-3 pl-1">
          {onToggleSelectAll && (
            <input
              type="checkbox"
              checked={allSelectedOnPage}
              ref={el => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={onToggleSelectAll}
              className="h-4 w-4 rounded border-[var(--border)] bg-[var(--card)] text-[var(--chart-2)] focus:ring-[var(--chart-2)] cursor-pointer"
              aria-label="Select all transactions on page"
            />
          )}
          <button
            type="button"
            onClick={() => onSortChange && onSortChange('merchant')}
            className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors group cursor-pointer"
          >
            <span>Transaction</span>
            {renderSortIcon('merchant')}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSortChange && onSortChange('date')}
          className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors group cursor-pointer text-left"
        >
          <span>Date</span>
          {renderSortIcon('date')}
        </button>

        <div>Rating</div>

        <div>Description</div>

        <button
          type="button"
          onClick={() => onSortChange && onSortChange('amount')}
          className="flex items-center justify-end gap-1.5 hover:text-[var(--foreground)] transition-colors group cursor-pointer text-right w-full"
        >
          <span>Amount</span>
          {renderSortIcon('amount')}
        </button>

        <div className="text-right sr-only">Actions</div>
      </div>
      
      {/* List */}
      <div className="flex flex-col p-2 gap-1 bg-[var(--color-bg-primary)]">
        <AnimatePresence>
          {transactions.map((transaction) => (
            <TransactionRow 
              key={transaction.id} 
              transaction={transaction} 
              isSelected={selectedIds.includes(transaction.id)}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});
