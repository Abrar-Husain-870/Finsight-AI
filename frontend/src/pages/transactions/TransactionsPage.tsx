import React, { useState, useRef, useCallback } from 'react';
import { useTransactions, useDeleteTransaction, useBulkDeleteTransactions } from '../../features/transactions/hooks/useTransactions.js';
import { TransactionTable } from '../../features/transactions/components/TransactionTable.js';
import { TransactionModal } from '../../features/transactions/components/TransactionModal.js';
import { DeleteConfirmationDialog } from '../../features/transactions/components/DeleteConfirmationDialog.js';
import { SearchBar } from '../../features/transactions/components/SearchBar.js';
import { DateRangePicker, DateRange } from '../../features/transactions/components/DateRangePicker.js';
import { ParentCategoryFilter } from '../../features/transactions/components/ParentCategoryFilter.js';
import { SubCategoryFilter } from '../../features/transactions/components/SubCategoryFilter.js';
import { SortFilterDropdown } from '../../features/transactions/components/SortFilterDropdown.js';
import { Pagination } from '../../components/ui/Pagination.js';
import { Plus, SlidersHorizontal, X, ArrowUpDown, Download, Trash2, CheckSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { TransactionResponse, TransactionFilterInput, fromMinor } from '@finsight/shared';
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

  // Selection & Bulk Action States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

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
  const bulkDeleteMutation = useBulkDeleteTransactions();
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

  const handleSortChange = useCallback((field: 'date' | 'amount' | 'merchant') => {
    setFilters(prev => {
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 };
      }
      return { ...prev, sortBy: field, sortOrder: field === 'merchant' ? 'asc' : 'desc', page: 1 };
    });
  }, []);

  const handleSortDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    switch (val) {
      case 'date_desc': setFilters(prev => ({ ...prev, sortBy: 'date', sortOrder: 'desc', page: 1 })); break;
      case 'date_asc': setFilters(prev => ({ ...prev, sortBy: 'date', sortOrder: 'asc', page: 1 })); break;
      case 'amount_desc': setFilters(prev => ({ ...prev, sortBy: 'amount', sortOrder: 'desc', page: 1 })); break;
      case 'amount_asc': setFilters(prev => ({ ...prev, sortBy: 'amount', sortOrder: 'asc', page: 1 })); break;
      case 'merchant_asc': setFilters(prev => ({ ...prev, sortBy: 'merchant', sortOrder: 'asc', page: 1 })); break;
      case 'merchant_desc': setFilters(prev => ({ ...prev, sortBy: 'merchant', sortOrder: 'desc', page: 1 })); break;
      default: break;
    }
  };

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    if (!data?.data) return;
    const pageIds = data.data.map(t => t.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  }, [data?.data, selectedIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleExportSelected = () => {
    const selectedTxs = (data?.data || []).filter(t => selectedIds.includes(t.id));
    if (selectedTxs.length === 0) return;

    const headers = ['ID', 'Date', 'Merchant', 'Description', 'Amount', 'Category ID', 'Notes'];
    const rows = selectedTxs.map(t => [
      t.id,
      t.date,
      `"${(t.merchant || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      fromMinor(t.amount),
      t.categoryId,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedTxs.length} transaction${selectedTxs.length > 1 ? 's' : ''}`);
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
          setSelectedIds(prev => prev.filter(id => id !== txToDelete.id));
        },
        onError: () => toast.error('Failed to delete transaction')
      });
    }
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          toast.success(`Deleted ${selectedIds.length} transaction${selectedIds.length > 1 ? 's' : ''}`);
          setIsBulkDeleteDialogOpen(false);
          setSelectedIds([]);
        },
        onError: () => toast.error('Failed to delete selected transactions')
      });
    }
  };

  const hasActiveFilters = !!(filters.merchant || dateRange.startDate || parentCategoryId || subCategoryId);
  const currentSortKey = `${filters.sortBy}_${filters.sortOrder}`;

  return (
    <div className="flex flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-6 sm:gap-8">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Transactions</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
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

      {/* ── Bulk Action Toolbar (Active when 1 or more selected) ──────────── */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 px-5 rounded-[var(--radius-xl)] bg-[var(--card)] border border-[var(--chart-2)]/40 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[var(--chart-2)]/10 text-[var(--chart-2)] font-bold text-xs">
              {selectedIds.length}
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {selectedIds.length} transaction{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelected}
              className="text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedIds.length})
            </Button>
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Filter & Sort Bar ────────────────────────────────────────────────── */}
      <div className={cn(
        'flex flex-col sm:flex-row gap-3 p-3.5 rounded-[var(--radius-xl)]',
        'border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]',
      )}>
        {/* Left group: icon + label */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[var(--border)] shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
          <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Filters</span>
        </div>

        {/* Filter & Sort controls */}
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

          {/* Sort Dropdown */}
          <SortFilterDropdown
            value={currentSortKey}
            onChange={(newSortKey) => {
              const [sortBy, sortOrder] = newSortKey.split('_') as ['date' | 'amount' | 'merchant', 'asc' | 'desc'];
              setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
            }}
          />

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              type="button"
              id="clear-all-filters-btn"
              onClick={handleClearAllFilters}
              className={cn(
                'flex items-center gap-1.5 h-10 px-3 rounded-[var(--radius-lg)] text-xs font-medium',
                'text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10',
                'border border-[var(--border)] transition-all duration-150',
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
          <div className="flex flex-wrap gap-1.5 sm:border-l sm:border-[var(--border)] sm:pl-3 items-center">
            {filters.merchant && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                Merchant: <em className="not-italic font-semibold">{filters.merchant}</em>
              </span>
            )}
            {parentCategoryId && !subCategoryId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                📁 Category Filter
              </span>
            )}
            {subCategoryId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                🏷️ Sub-Category Filter
              </span>
            )}
            {dateRange.startDate && dateRange.endDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]">
                📅&nbsp;
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dateRange.startDate)}
                &nbsp;–&nbsp;
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateRange.endDate)}
              </span>
            )}
            {dateRange.startDate && !dateRange.endDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]">
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
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)] flex flex-col">
            <div className="flex-1 overflow-auto">
              <TransactionTable
                transactions={data?.data || []}
                isLoading={isLoading}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
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

      <DeleteConfirmationDialog
        isOpen={isBulkDeleteDialogOpen}
        onCancel={() => {
          setIsBulkDeleteDialogOpen(false);
        }}
        onConfirm={confirmBulkDelete}
        isDeleting={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
