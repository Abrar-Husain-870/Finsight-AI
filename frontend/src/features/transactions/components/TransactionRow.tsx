import React from 'react';
import { TransactionResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils.js';

interface TransactionRowProps {
  transaction: TransactionResponse;
  onEdit: (tx: TransactionResponse) => void;
  onDelete: (tx: TransactionResponse) => void;
}

export const TransactionRow = React.memo(function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const { formatMoney } = useCurrency();
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

  // Extract rating from notes if present
  const ratingMatch = transaction.notes?.match(/^(?:⭐\s*Rating|\[Rating\]):\s*([1-5])\/5/i);
  const ratingValue = ratingMatch && ratingMatch[1] ? parseInt(ratingMatch[1], 10) : null;

  return (
    <>
      {/* Desktop Grid Row */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="hidden sm:grid grid-cols-[2fr_1fr_1.5fr_1fr_80px] gap-4 items-center px-4 py-3 rounded-[var(--radius-lg)] group hover:bg-[var(--color-bg-secondary)] transition-colors cursor-default"
      >
        <div className="flex items-center gap-4 pl-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] group-hover:bg-[var(--color-bg-secondary)] transition-colors shadow-xs">
            <CategoryIcon name={categoryIcon} className="h-4 w-4 text-[var(--color-text-primary)]" colorClass="bg-transparent" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-[var(--color-text-primary)]">{transaction.merchant || 'Unknown Merchant'}</span>
              {ratingValue && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  ★ {ratingValue}/5
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">{categoryName}</span>
          </div>
        </div>
        
        <div className="text-sm text-[var(--color-text-secondary)] font-medium">
          {formattedDate}
        </div>
        
        <div className="text-sm text-[var(--color-text-secondary)] truncate max-w-[200px]">
          {transaction.description || '-'}
        </div>
        
        <div className={cn(
          "text-sm font-semibold tabular-nums text-right tracking-tight",
          transaction.amount < 0 ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"
        )}>
          {formatMoney(Math.abs(transaction.amount))}
        </div>
        
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 pr-2">
          <button onClick={() => onEdit(transaction)} aria-label={`Edit transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] transition-colors">
            <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button onClick={() => onDelete(transaction)} aria-label={`Delete transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] transition-colors">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* Mobile Card Row */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="sm:hidden flex flex-col p-4 mb-2 rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)]">
              <CategoryIcon name={categoryIcon} className="h-4 w-4 text-[var(--color-text-primary)]" colorClass="bg-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-[var(--color-text-primary)] text-sm">{transaction.merchant || 'Unknown Merchant'}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{categoryName}</span>
            </div>
          </div>
          <span className={cn(
            "font-semibold text-sm tabular-nums tracking-tight",
            transaction.amount < 0 ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"
          )}>
            {formatMoney(Math.abs(transaction.amount))}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1 pt-3 border-t border-[var(--color-border-primary)]">
          <span className="text-xs text-[var(--color-text-secondary)]">{formattedDate}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(transaction)} aria-label={`Edit transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded">
              <Edit2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button onClick={() => onDelete(transaction)} aria-label={`Delete transaction ${transaction.merchant}`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] rounded">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
});
