import React, { useState, useRef } from 'react';
import { useTransactions, useDeleteTransaction } from '../../features/transactions/hooks/useTransactions.js';
import { TransactionTable } from '../../features/transactions/components/TransactionTable.js';
import { TransactionDrawer } from '../../features/transactions/components/TransactionDrawer.js';
import { DeleteConfirmationDialog } from '../../features/transactions/components/DeleteConfirmationDialog.js';
import { SearchBar } from '../../features/transactions/components/SearchBar.js';
import { Pagination } from '../../components/ui/Pagination.js';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { TransactionResponse, TransactionFilterInput } from '@finsight/shared';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';
import { toast } from 'sonner';
import { ErrorState } from '../../components/ui/ErrorState.js';
import { useDebounce } from '../../hooks/useDebounce.js';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilterInput>({
    page: 1,
    limit: 15,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<TransactionResponse | null>(null);

  const debouncedMerchant = useDebounce(filters.merchant, 500);
  const queryFilters = React.useMemo(() => ({
    ...filters,
    merchant: debouncedMerchant
  }), [filters, debouncedMerchant]);

  const { data, isLoading, isError, error, refetch } = useTransactions(queryFilters);
  const deleteMutation = useDeleteTransaction();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts({
    'n': () => {
      setSelectedTx(null);
      setIsDrawerOpen(true);
    },
    '/': () => {
      searchInputRef.current?.focus();
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, merchant: e.target.value, page: 1 }));
  };

  const handleEdit = (tx: TransactionResponse) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const handleDeleteRequest = (tx: TransactionResponse) => {
    setTxToDelete(tx);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (txToDelete) {
      deleteMutation.mutate(txToDelete.id, {
        onSuccess: () => {
          toast.success('Transaction deleted');
          setIsDeleteDialogOpen(false);
          setTxToDelete(null);
        },
        onError: () => toast.error('Failed to delete transaction')
      });
    }
  };

  return (
    <div className="flex flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-8 sm:gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Transactions</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your income and expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar ref={searchInputRef} value={filters.merchant || ''} onChange={handleSearch} />
          <Button
            onClick={() => {
              setSelectedTx(null);
              setIsDrawerOpen(true);
            }}
            size="md"
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            New
          </Button>
        </div>
      </div>

      <div className="w-full">
        {isError ? (
          <ErrorState 
            title="Failed to load transactions"
            description={error instanceof Error ? error.message : "An unexpected error occurred."}
            onRetry={refetch}
          />
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)] flex flex-col">
            <div className="flex-1 overflow-auto">
              <TransactionTable 
                transactions={data?.data || []} 
                isLoading={isLoading} 
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            </div>
            
            <Pagination 
              page={filters.page || 1} 
              totalPages={data?.meta.totalPages || 1}
              onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
            />
          </div>
        )}
      </div>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setTxToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
