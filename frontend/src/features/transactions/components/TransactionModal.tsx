import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, TransactionResponse, CreateTransactionInput } from '@finsight/shared';
import { CategoryPicker } from '../../categories/components/CategoryPicker.js';
import { AmountInput } from '../../../components/ui/AmountInput.js';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';
import { useFocusTrap } from '../../../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts.js';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, PlusCircle, Pencil, Receipt, CalendarDays, Store,
  FileText, StickyNote, ArrowUpCircle, ArrowDownCircle, Star
} from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionResponse | null;
}

// ─── Rating Helper Functions ──────────────────────────────────────────────────
export function parseRatingAndNotes(notes?: string | null): { rating: number | null; userNotes: string } {
  if (!notes) return { rating: null, userNotes: '' };
  const match = notes.match(/^(?:⭐\s*Rating|\[Rating\]):\s*([1-5])\/5(?:\r?\n\r?\n|\r?\n)?([\s\S]*)?$/i);
  if (match && match[1]) {
    return {
      rating: parseInt(match[1], 10),
      userNotes: (match[2] || '').trim(),
    };
  }
  return { rating: null, userNotes: notes };
}

export function formatNotesWithRating(rating: number | null, userNotes?: string): string {
  const cleanNotes = (userNotes || '').trim();
  if (rating && rating >= 1 && rating <= 5) {
    return cleanNotes ? `⭐ Rating: ${rating}/5\n${cleanNotes}` : `⭐ Rating: ${rating}/5`;
  }
  return cleanNotes;
}

const RATING_DESCRIPTIONS: Record<number, { label: string; emoji: string; colorClass: string }> = {
  1: { label: 'Unnecessary / Regret', emoji: '😡', colorClass: 'text-red-500' },
  2: { label: 'Low Value / Impulsive', emoji: '😕', colorClass: 'text-orange-500' },
  3: { label: 'Neutral / Standard', emoji: '😐', colorClass: 'text-amber-500' },
  4: { label: 'Good Value / Useful', emoji: '🙂', colorClass: 'text-emerald-500' },
  5: { label: 'Essential / Great Buy', emoji: '🌟', colorClass: 'text-blue-500' },
};

// ─── Rating Input Component ─────────────────────────────────────────────────
function ExpenseRatingInput({
  rating,
  onChange,
}: {
  rating: number | null;
  onChange: (val: number | null) => void;
}) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const activeRating = hoverRating ?? rating;

  return (
    <div className="space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          <Star className="h-3.5 w-3.5 text-amber-400" />
          Expense Rating / Necessity (1 to 5)
        </span>
        {rating && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Clear rating
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = activeRating !== null && starIndex <= activeRating;
            return (
              <button
                key={starIndex}
                type="button"
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => onChange(rating === starIndex ? null : starIndex)}
                aria-label={`Rate ${starIndex} out of 5 stars`}
                className="p-1 rounded-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition-colors duration-150',
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                      : 'text-[var(--color-border-primary)] hover:text-amber-300',
                  )}
                />
              </button>
            );
          })}
        </div>

        {activeRating ? (
          <div className="flex items-center gap-1.5 text-xs font-medium pl-1">
            <span>{RATING_DESCRIPTIONS[activeRating]?.emoji}</span>
            <span className={cn('font-semibold', RATING_DESCRIPTIONS[activeRating]?.colorClass)}>
              {activeRating}/5
            </span>
            <span className="text-[var(--color-text-secondary)] text-[11px]">
              — {RATING_DESCRIPTIONS[activeRating]?.label}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)] italic pl-1">
            Rate how valuable this purchase was
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Labelled Field Wrapper ───────────────────────────────────────────────────
function Field({
  label,
  required,
  icon: Icon,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
      >
        {Icon && <Icon className="h-3 w-3" />}
        {label}
        {required && <span className="text-[var(--color-danger)] text-xs normal-case tracking-normal font-normal ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--color-danger)] flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Transaction Type Toggle ──────────────────────────────────────────────────
function TypeToggle({
  value,
  onChange,
}: {
  value: 'expense' | 'income';
  onChange: (v: 'expense' | 'income') => void;
}) {
  return (
    <div className="flex rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-1 gap-1">
      {(['expense', 'income'] as const).map(type => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[var(--radius-md)] text-xs font-semibold transition-all duration-200',
            value === type
              ? type === 'expense'
                ? 'bg-[var(--color-danger)] text-white shadow-xs'
                : 'bg-[var(--color-success)] text-white shadow-xs'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
          )}
        >
          {type === 'expense'
            ? <ArrowDownCircle className="h-3.5 w-3.5" />
            : <ArrowUpCircle className="h-3.5 w-3.5" />}
          <span className="capitalize">{type}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const { currency: userCurrency } = useCurrency();

  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [rating, setRating] = useState<number | null>(null);

  const parsedNotes = transaction?.notes ? parseRatingAndNotes(transaction.notes) : { rating: null, userNotes: '' };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: transaction?.amount ? Math.abs(transaction.amount) : 0,
      categoryId: transaction?.categoryId ?? '',
      date: transaction?.date
        ? new Date(transaction.date).toISOString().split('T')[0] + 'T12:00:00Z'
        : new Date().toISOString(),
      merchant: transaction?.merchant ?? '',
      description: transaction?.description ?? '',
      notes: parsedNotes.userNotes,
      currency: transaction?.currency ?? userCurrency,
    },
  });

  // Sync type toggle & rating with initial data
  useEffect(() => {
    if (transaction) {
      setTxType(transaction.amount < 0 ? 'expense' : 'income');
      const { rating: initialRating, userNotes } = parseRatingAndNotes(transaction.notes);
      setRating(initialRating);
      reset({
        amount: Math.abs(transaction.amount),
        categoryId: transaction.categoryId ?? '',
        date: transaction.date
          ? new Date(transaction.date).toISOString().split('T')[0] + 'T12:00:00Z'
          : new Date().toISOString(),
        merchant: transaction.merchant ?? '',
        description: transaction.description ?? '',
        notes: userNotes,
        currency: transaction.currency ?? userCurrency,
      });
    } else {
      setTxType('expense');
      setRating(null);
      reset({
        amount: 0,
        categoryId: '',
        date: new Date().toISOString().split('T')[0] + 'T12:00:00Z',
        merchant: '',
        description: '',
        notes: '',
        currency: userCurrency,
      });
    }
  }, [transaction, isOpen, reset, userCurrency]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const modalRef = useFocusTrap(isOpen);

  useKeyboardShortcuts({
    escape: () => { if (isOpen) onClose(); },
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useUnsavedChanges(isDirty, 'You have unsaved transaction details. Are you sure you want to leave?');

  const onSubmit = (data: CreateTransactionInput) => {
    const signedAmount = txType === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);
    
    // Format notes to include rating if expense
    const finalNotes = txType === 'expense'
      ? formatNotesWithRating(rating, data.notes)
      : (data.notes || '');

    const payload = {
      ...data,
      amount: signedAmount,
      date: new Date(data.date).toISOString(),
      notes: finalNotes,
    };

    if (transaction) {
      updateMutation.mutate(
        { id: transaction.id, data: payload },
        {
          onSuccess: () => { toast.success('Transaction updated'); onClose(); },
          onError: () => toast.error('Failed to update transaction'),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success('Transaction created'); onClose(); },
        onError: () => toast.error('Failed to create transaction'),
      });
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Discard them?')) onClose();
    } else {
      onClose();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Full-viewport backdrop overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto fixed inset-0 bg-black/30 z-[9998]"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal Card - Dead center of the viewport */}
          <motion.div
            key="modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tx-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            className={cn(
              'pointer-events-auto relative z-[9999] w-full max-w-lg max-h-[85vh]',
              'bg-[var(--color-bg-primary)] rounded-[var(--radius-2xl)]',
              'border border-[var(--color-border-primary)]',
              'shadow-2xl shadow-black/30',
              'flex flex-col',
              'outline-none',
            )}
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[var(--color-border-primary)]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]',
                  transaction
                    ? 'bg-[var(--color-accent-muted)]'
                    : 'bg-[var(--color-accent-primary)]',
                )}>
                  {transaction
                    ? <Pencil className="h-4 w-4 text-[var(--color-accent-primary)]" />
                    : <PlusCircle className="h-4 w-4 text-[var(--color-accent-primary-foreground)]" />}
                </div>
                <div>
                  <h2
                    id="tx-modal-title"
                    className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
                  >
                    {transaction ? 'Edit Transaction' : 'New Transaction'}
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {transaction ? 'Update the transaction details below.' : 'Record a new income or expense.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Scrollable Form Body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <form
                id="transaction-modal-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4.5"
              >
                {/* Validation summary */}
                {Object.keys(errors).length > 0 && (
                  <div
                    id="validation-summary"
                    role="alert"
                    tabIndex={-1}
                    className="rounded-[var(--radius-lg)] bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 px-4 py-3 text-sm font-medium text-[var(--color-danger)] outline-none"
                  >
                    Please correct the highlighted fields below.
                  </div>
                )}

                {/* Type Toggle */}
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Transaction Type
                  </span>
                  <TypeToggle value={txType} onChange={(newType) => {
                    setTxType(newType);
                    if (newType === 'income') setRating(null);
                  }} />
                </div>

                {/* Amount + Currency */}
                <Field
                  label="Amount"
                  required
                  icon={Receipt}
                  htmlFor="tx-amount"
                  error={errors.amount?.message as string}
                >
                  <div className="relative">
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <AmountInput
                          id="tx-amount"
                          value={Math.abs(field.value)}
                          onChange={field.onChange}
                          error={errors.amount?.message as string}
                          placeholder="0.00"
                        />
                      )}
                    />
                    <div className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2',
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)]',
                      txType === 'expense'
                        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
                        : 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
                    )}>
                      {txType === 'expense' ? '− ' : '+ '}{userCurrency}
                    </div>
                  </div>
                </Field>

                {/* Expense Rating Option (1 to 5 Stars) */}
                {txType === 'expense' && (
                  <ExpenseRatingInput
                    rating={rating}
                    onChange={setRating}
                  />
                )}

                {/* Date */}
                <Field
                  label="Date"
                  required
                  icon={CalendarDays}
                  htmlFor="tx-date"
                  error={errors.date?.message as string}
                >
                  <input
                    id="tx-date"
                    type="date"
                    {...register('date')}
                    onChange={(e) => {
                      register('date').onChange({
                        target: {
                          name: 'date',
                          value: e.target.value ? `${e.target.value}T12:00:00Z` : '',
                        },
                      });
                    }}
                    value={(control._formValues.date as string)?.split('T')[0] || ''}
                    className={cn(
                      'flex h-10 w-full rounded-[var(--radius-lg)] border px-3 py-2 text-sm',
                      'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
                      'border-[var(--color-border-primary)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent',
                      'transition-colors shadow-xs',
                      errors.date && 'border-[var(--color-danger)]',
                    )}
                  />
                </Field>

                {/* Category */}
                <Field
                  label="Category"
                  required
                  icon={FileText}
                  error={errors.categoryId?.message as string}
                >
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <CategoryPicker
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.categoryId?.message as string}
                      />
                    )}
                  />
                </Field>

                {/* Merchant */}
                <Field
                  label="Merchant / Payee"
                  icon={Store}
                  htmlFor="tx-merchant"
                  error={errors.merchant?.message as string}
                >
                  <input
                    id="tx-merchant"
                    type="text"
                    {...register('merchant')}
                    placeholder="e.g. Starbucks, Amazon, Salary"
                    className={cn(
                      'flex h-10 w-full rounded-[var(--radius-lg)] border px-3 py-2 text-sm',
                      'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
                      'border-[var(--color-border-primary)] placeholder:text-[var(--color-text-muted)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent',
                      'transition-colors shadow-xs',
                      errors.merchant && 'border-[var(--color-danger)]',
                    )}
                  />
                </Field>

                {/* Description */}
                <Field
                  label="Description"
                  icon={FileText}
                  htmlFor="tx-description"
                  error={errors.description?.message as string}
                >
                  <input
                    id="tx-description"
                    type="text"
                    {...register('description')}
                    placeholder="Short description (optional)"
                    className={cn(
                      'flex h-10 w-full rounded-[var(--radius-lg)] border px-3 py-2 text-sm',
                      'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
                      'border-[var(--color-border-primary)] placeholder:text-[var(--color-text-muted)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent',
                      'transition-colors shadow-xs',
                    )}
                  />
                </Field>

                {/* Notes */}
                <Field
                  label="Notes"
                  icon={StickyNote}
                  htmlFor="tx-notes"
                >
                  <textarea
                    id="tx-notes"
                    {...register('notes')}
                    rows={2}
                    placeholder="Any extra details, reference numbers, etc."
                    className={cn(
                      'flex w-full rounded-[var(--radius-lg)] border px-3 py-2.5 text-sm',
                      'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
                      'border-[var(--color-border-primary)] placeholder:text-[var(--color-text-muted)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent',
                      'transition-colors shadow-xs resize-none',
                    )}
                  />
                </Field>
              </form>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 pb-6 pt-4 border-t border-[var(--color-border-primary)] flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  'flex-1 h-11 rounded-[var(--radius-lg)] text-sm font-semibold',
                  'border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
                  'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="transaction-modal-form"
                disabled={isSubmitting}
                className={cn(
                  'flex-[2] h-11 rounded-[var(--radius-lg)] text-sm font-semibold',
                  'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)]',
                  'hover:opacity-90 active:opacity-80 transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2 shadow-xs',
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                    {transaction ? 'Saving…' : 'Creating…'}
                  </>
                ) : (
                  <>
                    {transaction ? <Pencil className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                    {transaction ? 'Save Changes' : 'Create Transaction'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
