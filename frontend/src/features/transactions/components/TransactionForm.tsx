import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, TransactionResponse, CreateTransactionInput } from '@finsight/shared';
import { CategoryPicker } from '../../categories/components/CategoryPicker.js';
import { AmountInput } from '../../../components/ui/AmountInput.js';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions.js';
import { toast } from 'sonner';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';

interface TransactionFormProps {
  initialData?: TransactionResponse | null | undefined;
  onSuccess: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function TransactionForm({ initialData, onSuccess, onDirtyChange }: TransactionFormProps) {
  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: initialData?.amount ?? 0,
      categoryId: initialData?.categoryId ?? '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] + 'T12:00:00Z' : new Date().toISOString(),
      merchant: initialData?.merchant ?? '',
      description: initialData?.description ?? '',
      notes: initialData?.notes ?? '',
      currency: initialData?.currency ?? 'USD',
    }
  });

  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useUnsavedChanges(isDirty, 'You have unsaved transaction details. Are you sure you want to leave?');

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CreateTransactionInput) => {
    const payload = {
      ...data,
      date: new Date(data.date).toISOString() // Ensure ISO format
    };

    if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Transaction updated');
            onSuccess();
          },
          onError: () => toast.error('Failed to update transaction')
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Transaction created');
          onSuccess();
        },
        onError: () => toast.error('Failed to create transaction')
      });
    }
  };

  const onError = () => {
    // Focus the validation summary if there are errors
    setTimeout(() => {
      document.getElementById('validation-summary')?.focus();
    }, 0);
  };

  return (
    <form id="transaction-form" onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-5">
      {Object.keys(errors).length > 0 && (
        <div 
          id="validation-summary" 
          tabIndex={-1} 
          role="alert" 
          className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm font-medium text-[var(--color-danger)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
        >
          Please correct the errors below.
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="amount" className="text-sm font-medium text-[var(--color-text-primary)]">Amount <span className="text-[var(--color-danger)]">*</span></label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <AmountInput
              value={field.value}
              onChange={field.onChange}
              error={errors.amount?.message as string}
              placeholder="0.00"
            />
          )}
        />
        {errors.amount && <p className="text-xs text-[var(--color-danger)]">{errors.amount.message as string}</p>}
      </div>

      <div className="space-y-1">
        <label id="category-label" className="text-sm font-medium text-[var(--color-text-primary)]">Category <span className="text-[var(--color-danger)]">*</span></label>
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
        {errors.categoryId && <p className="text-xs text-[var(--color-danger)]">{errors.categoryId.message as string}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="date" className="text-sm font-medium text-[var(--color-text-primary)]">Date <span className="text-[var(--color-danger)]">*</span></label>
        <input
          id="date"
          type="date"
          {...register('date')}
          className="flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors"
          onChange={(e) => {
            // Need to append time to make it valid ISO string for zod if we use date string
            register('date').onChange({
              target: {
                name: 'date',
                value: e.target.value ? `${e.target.value}T12:00:00Z` : ''
              }
            });
          }}
          value={(control._formValues.date as string)?.split('T')[0] || ''}
        />
        {errors.date && <p className="text-xs text-[var(--color-danger)]">{errors.date.message as string}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="merchant" className="text-sm font-medium text-[var(--color-text-primary)]">Merchant</label>
        <input
          id="merchant"
          type="text"
          {...register('merchant')}
          placeholder="e.g. Starbucks"
          className="flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-[var(--color-text-primary)]">Description</label>
        <input
          id="description"
          type="text"
          {...register('description')}
          placeholder="Optional description"
          className="flex h-10 w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="text-sm font-medium text-[var(--color-text-primary)]">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional notes..."
          rows={3}
          className="flex w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 flex w-full justify-center rounded-md bg-[var(--color-accent-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Transaction'}
      </button>
    </form>
  );
}
