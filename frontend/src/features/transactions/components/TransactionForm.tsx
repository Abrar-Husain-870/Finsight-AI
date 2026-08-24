import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, TransactionResponse, CreateTransactionInput } from '@finsight/shared';
import { CategoryPicker } from '../../categories/components/CategoryPicker.js';
import { AmountInput } from '../../../components/ui/AmountInput.js';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions.js';
import { toast } from 'sonner';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges.js';
import { Input } from '../../../components/ui/Input.js';
import { Button } from '../../../components/ui/Button.js';

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
    <form id="transaction-form" onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6 pt-4">
      {Object.keys(errors).length > 0 && (
        <div 
          id="validation-summary" 
          tabIndex={-1} 
          role="alert" 
          className="rounded-md bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 p-3 text-sm font-medium text-[var(--color-danger)] outline-none"
        >
          Please correct the errors below.
        </div>
      )}
      
      <div className="space-y-1.5">
        <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Amount <span className="text-[var(--color-danger)]">*</span></label>
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

      <div className="space-y-1.5">
        <label id="category-label" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Category <span className="text-[var(--color-danger)]">*</span></label>
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

      <div className="space-y-1.5">
        <label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Date <span className="text-[var(--color-danger)]">*</span></label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          onChange={(e) => {
            register('date').onChange({
              target: {
                name: 'date',
                value: e.target.value ? `${e.target.value}T12:00:00Z` : ''
              }
            });
          }}
          value={(control._formValues.date as string)?.split('T')[0] || ''}
          error={errors.date?.message as string}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="merchant" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Merchant</label>
        <Input
          id="merchant"
          type="text"
          {...register('merchant')}
          placeholder="e.g. Starbucks"
          error={errors.merchant?.message as string}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Description</label>
        <Input
          id="description"
          type="text"
          {...register('description')}
          placeholder="Optional description"
          error={errors.description?.message as string}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional notes..."
          rows={3}
          className="flex w-full rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-4 py-2 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] focus-visible:border-transparent transition-all duration-200 resize-none shadow-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full mt-4"
        size="lg"
      >
        {initialData ? 'Save Changes' : 'Create Transaction'}
      </Button>
    </form>
  );
}
