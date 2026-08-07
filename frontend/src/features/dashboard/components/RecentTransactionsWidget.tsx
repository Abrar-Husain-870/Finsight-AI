import React from 'react';
import { TransactionResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { useCategoryTree } from '../../categories/hooks/useCategories.js';
import { CategoryIcon } from '../../categories/components/CategoryIcon.js';
import { motion } from 'framer-motion';

export function RecentTransactionsWidget({ transactions }: { transactions: TransactionResponse[] }) {
  const { formatMoney } = useCurrency();
  const { data: tree } = useCategoryTree();

  if (transactions.length === 0) {
    return <div className="flex py-6 items-center justify-center text-sm text-[var(--color-text-secondary)]">No recent transactions</div>;
  }

  const getCategoryDetails = (categoryId: string) => {
    let name = 'Unknown';
    let icon = 'HelpCircle';
    let color = 'gray-500';
    
    if (tree) {
      for (const parent of tree) {
        if (parent.id === categoryId) {
          name = parent.name;
          icon = parent.icon;
          color = parent.color;
          break;
        }
        const child = parent.children.find(c => c.id === categoryId);
        if (child) {
          name = child.name;
          icon = child.icon;
          color = child.color;
          break;
        }
      }
    }
    return { name, icon, color };
  };

  return (
    <div className="flex flex-col gap-1">
      {transactions.slice(0, 5).map((tx, i) => {
        const { name, icon, color } = getCategoryDetails(tx.categoryId);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(new Date(tx.date));

        return (
          <motion.div 
            key={tx.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] hover:bg-[var(--color-bg-secondary)]/50 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] group-hover:bg-[var(--color-bg-primary)] transition-colors shadow-sm">
                <CategoryIcon name={icon} className={`text-${color} h-4 w-4`} colorClass="bg-transparent" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-[var(--color-text-primary)]">{tx.merchant || 'Unknown Merchant'}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">{name} • {formattedDate}</span>
              </div>
            </div>
            <div className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight">
              {formatMoney(tx.amount)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
