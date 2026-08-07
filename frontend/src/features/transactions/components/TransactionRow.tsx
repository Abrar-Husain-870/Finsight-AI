import React from 'react';
import { TransactionResponse, formatMoney } from '@finsight/shared';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionRowProps {
  transaction: TransactionResponse;
  onEdit: (tx: TransactionResponse) => void;
  onDelete: (tx: TransactionResponse) => void;
}

export const TransactionRow = React.memo(function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const { data: tree } = useCategoryTree();
  
  // Find category details
  let categoryName = 'Unknown Category';
  let categoryIcon = 'HelpCircle';
  let categoryColor = 'gray-500';

  if (tree) {
    for (const parent of tree) {
      if (parent.id === transaction.categoryId) {
        categoryName = parent.name;
        categoryIcon = parent.icon;
        categoryColor = parent.color;
        break;
      }
      const child = parent.children.find(c => c.id === transaction.categoryId);
      if (child) {
        categoryName = child.name;
        categoryIcon = child.icon;
        categoryColor = child.color;
        break;
      }
    }
  }

  // Format date natively
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(transaction.date));

  return (
    <>
      {/* Desktop Table Row */}
      <motion.tr 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="hidden sm:table-row group border-b border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]/50 transition-colors"
      >
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center gap-3">
            <CategoryIcon name={categoryIcon} className={`text-${categoryColor}`} colorClass="bg-transparent border border-[var(--color-border-primary)] p-1.5" />
            <div className="flex flex-col">
              <span className="font-medium text-[var(--color-text-primary)]">{transaction.merchant || 'Unknown Merchant'}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{categoryName}</span>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--color-text-secondary)]">
          {formattedDate}
        </td>
        <td className="px-3 py-4 text-sm text-[var(--color-text-secondary)] truncate max-w-[200px]">
          {transaction.description || '-'}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-right text-[var(--color-text-primary)]">
          {formatMoney(transaction.amount, transaction.currency)}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <button onClick={() => onEdit(transaction)} aria-label={`Edit transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded">
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button onClick={() => onDelete(transaction)} aria-label={`Delete transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] rounded">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Mobile Card Row */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="sm:hidden flex flex-col p-4 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)]/30 transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <CategoryIcon name={categoryIcon} className={`text-${categoryColor}`} colorClass="bg-[var(--color-bg-secondary)] p-2" />
            <div className="flex flex-col">
              <span className="font-medium text-[var(--color-text-primary)] text-sm">{transaction.merchant || 'Unknown Merchant'}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{categoryName}</span>
            </div>
          </div>
          <span className="font-semibold text-[var(--color-text-primary)] text-sm">{formatMoney(transaction.amount, transaction.currency)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[var(--color-text-secondary)]">{formattedDate}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => onEdit(transaction)} aria-label={`Edit transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded">
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button onClick={() => onDelete(transaction)} aria-label={`Delete transaction ${transaction.merchant}`} className="text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] rounded">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
});
