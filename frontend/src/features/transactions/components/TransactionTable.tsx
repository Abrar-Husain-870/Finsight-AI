import React from 'react';
import { TransactionResponse } from '@finsight/shared';
import { TransactionRow } from './TransactionRow.js';
import { FileText } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { EmptyState } from '../../../components/ui/EmptyState.js';

interface TransactionTableProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
  onEdit: (tx: TransactionResponse) => void;
  onDelete: (tx: TransactionResponse) => void;
}

export const TransactionTable = React.memo(function TransactionTable({ transactions, isLoading, onEdit, onDelete }: TransactionTableProps) {
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

  return (
    <div className="w-full flex flex-col">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1.5fr_1fr_80px] gap-4 px-6 py-4 bg-[var(--color-bg-secondary)]/30 border-b border-[var(--color-border-primary)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
        <div>Transaction</div>
        <div>Date</div>
        <div>Description</div>
        <div className="text-right">Amount</div>
        <div className="text-right sr-only">Actions</div>
      </div>
      
      {/* List */}
      <div className="flex flex-col p-2 gap-1 bg-[var(--color-bg-primary)]">
        <AnimatePresence>
          {transactions.map((transaction) => (
            <TransactionRow 
              key={transaction.id} 
              transaction={transaction} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});
