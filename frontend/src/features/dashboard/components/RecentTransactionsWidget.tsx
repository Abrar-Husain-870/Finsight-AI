import React from 'react';
import { TransactionResponse } from '@finsight/shared';
import { TransactionRow } from '../../transactions/components/TransactionRow.js';
import { useNavigate } from 'react-router-dom';

export function RecentTransactionsWidget({ transactions }: { transactions: TransactionResponse[] }) {
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return <div className="flex py-6 items-center justify-center text-sm text-[var(--color-text-secondary)]">No recent transactions</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="hidden min-w-full divide-y divide-[var(--color-border-primary)] sm:table">
          <tbody className="divide-y divide-[var(--color-border-primary)]">
            {transactions.map(tx => (
              <TransactionRow 
                key={tx.id} 
                transaction={tx} 
                onEdit={() => navigate('/transactions')} 
                onDelete={() => navigate('/transactions')} 
              />
            ))}
          </tbody>
        </table>
        
        <div className="sm:hidden flex flex-col">
          {transactions.map(tx => (
             <TransactionRow 
               key={tx.id} 
               transaction={tx} 
               onEdit={() => navigate('/transactions')} 
               onDelete={() => navigate('/transactions')} 
             />
          ))}
        </div>
      </div>
    </div>
  );
}
