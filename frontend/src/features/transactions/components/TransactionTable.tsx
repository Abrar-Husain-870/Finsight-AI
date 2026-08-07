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
    <div className="w-full">
      <table className="hidden min-w-full divide-y divide-[var(--color-border-primary)] sm:table">
        <caption className="sr-only">List of transactions</caption>
        <thead className="bg-[var(--color-bg-secondary)]/50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider sm:pl-6">
              Transaction
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
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
        </tbody>
      </table>
      
      {/* Mobile view rendering implicitly inside TransactionRow components */}
      <div className="sm:hidden flex flex-col">
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
