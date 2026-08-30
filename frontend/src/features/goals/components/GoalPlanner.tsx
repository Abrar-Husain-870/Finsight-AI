import React, { useState } from 'react';
import { GoalResponse } from '@finsight/shared';
import { useCreateGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoals.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { useFocusTrap } from '../../../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts.js';
import { mapHttpError } from '../../../lib/errors.js';
import { AlertCircle } from 'lucide-react';

interface Props {
  goal?: GoalResponse | undefined;
  onClose: () => void;
}

export function GoalPlanner({ goal, onClose }: Props) {
  const modalRef = useFocusTrap(true);
  useKeyboardShortcuts({ escape: onClose });

  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();

  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal ? (goal.targetAmount / 100).toString() : '');
  const [currentAmount, setCurrentAmount] = useState(goal ? (goal.currentAmount / 100).toString() : '0');
  const [targetDate, setTargetDate] = useState(goal ? new Date(goal.targetDate).toISOString().split('T')[0] : '');
  const [color, setColor] = useState(goal?.color || '#1c1917');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    const targetVal = parseFloat(targetAmount);
    if (isNaN(targetVal) || targetVal <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }

    const currentVal = parseFloat(currentAmount);
    if (isNaN(currentVal) || currentVal < 0) {
      newErrors.currentAmount = 'Current saved must be 0 or greater';
    } else if (!isNaN(targetVal) && currentVal > targetVal) {
      newErrors.currentAmount = 'Current saved cannot exceed target amount';
    }

    if (!targetDate || isNaN(new Date(targetDate).getTime())) {
      newErrors.targetDate = 'A valid target date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    const payload = {
      name: name.trim(),
      targetAmount: Math.round(parseFloat(targetAmount) * 100),
      currentAmount: Math.round(parseFloat(currentAmount) * 100),
      targetDate: new Date(targetDate || new Date()).toISOString(),
      color,
    };

    if (goal) {
      updateMutation.mutate(
        { id: goal.id, data: payload },
        {
          onSuccess: onClose,
          onError: (err) => {
            const appError = mapHttpError(err);
            setSubmitError(appError.message || 'Failed to update goal.');
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: onClose,
        onError: (err) => {
          const appError = mapHttpError(err);
          setSubmitError(appError.message || 'Failed to create goal.');
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        ref={modalRef} 
        tabIndex={-1} 
        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 focus:outline-none"
      >
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{goal ? 'Edit Goal' : 'Create Goal'}</h2>

        {submitError && (
          <div role="alert" className="flex items-center gap-2 rounded-md bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 p-3 text-xs font-medium text-[var(--color-danger)]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Goal Name</label>
            <Input 
              required 
              value={name} 
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }} 
              placeholder="e.g. New Car"
              error={errors.name}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Target Amount</label>
              <Input 
                required 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={targetAmount} 
                onChange={(e) => { setTargetAmount(e.target.value); setErrors(prev => ({ ...prev, targetAmount: '' })); }} 
                placeholder="0.00"
                error={errors.targetAmount}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Current Saved</label>
              <Input 
                required 
                type="number" 
                min="0" 
                step="0.01" 
                value={currentAmount} 
                onChange={(e) => { setCurrentAmount(e.target.value); setErrors(prev => ({ ...prev, currentAmount: '' })); }} 
                placeholder="0.00"
                error={errors.currentAmount}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Target Date</label>
              <Input 
                required 
                type="date" 
                value={targetDate} 
                onChange={(e) => { setTargetDate(e.target.value); setErrors(prev => ({ ...prev, targetDate: '' })); }}
                error={errors.targetDate}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Color</label>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                disabled={isSubmitting}
                className="w-full h-12 rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] cursor-pointer p-1" 
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 mt-4">
            {goal && (
              <Button 
                type="button" 
                variant="danger" 
                size="sm" 
                className="mr-auto" 
                onClick={() => deleteMutation.mutate(goal.id, { onSuccess: onClose })} 
                isLoading={deleteMutation.isPending}
                disabled={isSubmitting || deleteMutation.isPending}
              >
                Delete
              </Button>
            )}
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="sm" 
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {goal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
