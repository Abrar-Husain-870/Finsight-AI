import React, { useState, useRef, useCallback } from 'react';
import { useTransactions, useDeleteTransaction } from '../../features/transactions/hooks/useTransactions.js';
import { TransactionTable } from '../../features/transactions/components/TransactionTable.js';
import { TransactionModal } from '../../features/transactions/components/TransactionModal.js';
import { DeleteConfirmationDialog } from '../../features/transactions/components/DeleteConfirmationDialog.js';
import { SearchBar } from '../../features/transactions/components/SearchBar.js';
import { DateRangePicker, DateRange } from '../../features/transactions/components/DateRangePicker.js';
import { ParentCategoryFilter } from '../../features/transactions/components/ParentCategoryFilter.js';
import { SubCategoryFilter } from '../../features/transactions/components/SubCategoryFilter.js';
import { Pagination } from '../../components/ui/Pagination.js';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { TransactionResponse, TransactionFilterInput } from '@finsight/shared';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';
import { toast } from 'sonner';
import { ErrorState } from '../../components/ui/ErrorState.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { cn } from '../../lib/utils.js';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilterInput>({
    page: 1,
    limit: 15,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [parentCategoryId, setParentCategoryId] = useState<string | undefined>(undefined);
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<TransactionResponse | null>(null);

  const debouncedMerchant = useDebounce(filters.merchant, 500);

  const queryFilters = React.useMemo(() => {
    const f: TransactionFilterInput = {
      ...filters,
      merchant: debouncedMerchant,
      categoryId: subCategoryId || parentCategoryId || undefined,
    };
    if (dateRange.startDate) {
      f.startDate = dateRange.startDate.toISOString();
    } else {
      delete f.startDate;
    }
    if (dateRange.endDate) {
      // Use end of the selected day (23:59:59) so transactions on that day are included
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      f.endDate = end.toISOString();
    } else {
      delete f.endDate;
    }
    return f;
  }, [filters, debouncedMerchant, parentCategoryId, subCategoryId, dateRange]);

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

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleParentCategoryChange = useCallback((newParentId: string | undefined) => {
    setParentCategoryId(newParentId);
    setSubCategoryId(undefined);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSubCategoryChange = useCallback((newSubId: string | undefined) => {
    setSubCategoryId(newSubId);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, merchant: '', page: 1 }));
    setParentCategoryId(undefined);
    setSubCategoryId(undefined);
    setDateRange({ startDate: null, endDate: null });
  }, []);

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

  const hasActiveFilters = !!(filters.merchant || dateRange.startDate || parentCategoryId || subCategoryId);

  return (
    <div className="flex flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-6 sm:gap-8">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Transactions</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {data?.meta.total !== undefined
              ? `${data.meta.total.toLocaleString()} transaction${data.meta.total !== 1 ? 's' : ''} found`
              : 'Manage your income and expenses.'}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedTx(null);
            setIsDrawerOpen(true);
          }}
          size="md"
          id="new-transaction-btn"
        >
          <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
          New
        </Button>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col sm:flex-row gap-3 p-3.5 rounded-[var(--radius-xl)]',
        'border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] shadow-[var(--shadow-sm)]',
      )}>
        {/* Left group: icon + label */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[var(--color-border-primary)] shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-[var(--color-text-muted)]" />
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Filters</span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <SearchBar
            ref={searchInputRef}
            value={filters.merchant || ''}
            onChange={handleSearch}
            className="min-w-[180px] flex-1 max-w-xs"
          />

          {/* Category Filter */}
          <ParentCategoryFilter
            value={parentCategoryId}
            onChange={handleParentCategoryChange}
          />

          {/* Sub-Category Filter */}
          <SubCategoryFilter
            parentCategoryId={parentCategoryId}
            value={subCategoryId}
            onChange={handleSubCategoryChange}
          />

          {/* Date Range Picker */}
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              type="button"
              id="clear-all-filters-btn"
              onClick={handleClearAllFilters}
              className={cn(
                'flex items-center gap-1.5 h-10 px-3 rounded-[var(--radius-lg)] text-xs font-medium',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8',
                'border border-[var(--color-border-primary)] transition-all duration-150',
              )}
              aria-label="Clear all filters"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Active filter pills summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 sm:border-l sm:border-[var(--color-border-primary)] sm:pl-3 items-center">
            {filters.merchant && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]">
                Merchant: <em className="not-italic font-semibold">{filters.merchant}</em>
              </span>
            )}
            {parentCategoryId && !subCategoryId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]">
                📁 Category Filter
              </span>
            )}
            {subCategoryId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]">
                🏷️ Sub-Category Filter
              </span>
            )}
            {dateRange.startDate && dateRange.endDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]">
                📅&nbsp;
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dateRange.startDate)}
                &nbsp;–&nbsp;
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateRange.endDate)}
              </span>
            )}
            {dateRange.startDate && !dateRange.endDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]">
                📅&nbsp;From {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateRange.startDate)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
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

      {/* ── Modal / Dialogs ──────────────────────────────────────────────────── */}
      <TransactionModal
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
