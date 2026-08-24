
import React, { useState } from 'react';
import { GoalResponse } from '@finsight/shared';
import { useCreateGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoals.js';

interface Props {
  goal?: GoalResponse | undefined;
  onClose: () => void;
}

export function GoalPlanner({ goal, onClose }: Props) {
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();

  const [name, setName] = useState(goal?.name || '');
  // Using string to handle decimal input before conversion
  const [targetAmount, setTargetAmount] = useState(goal ? (goal.targetAmount / 100).toString() : '');
  const [currentAmount, setCurrentAmount] = useState(goal ? (goal.currentAmount / 100).toString() : '0');
  const [targetDate, setTargetDate] = useState(goal ? new Date(goal.targetDate).toISOString().split('T')[0] : '');
  const [color, setColor] = useState(goal?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      targetAmount: Math.round(parseFloat(targetAmount) * 100),
      currentAmount: Math.round(parseFloat(currentAmount) * 100),
      targetDate: new Date(targetDate || new Date()).toISOString(),
      color
    };

    if (goal) {
      updateMutation.mutate({ id: goal.id, data: payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{goal ? 'Edit Goal' : 'Create Goal'}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Goal Name</label>
            <input className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" required value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="e.g. New Car" />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Amount</label>
              <input className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" required type="number" min="1" step="0.01" value={targetAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Current Saved</label>
              <input className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" required type="number" min="0" step="0.01" value={currentAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentAmount(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Date</label>
              <input className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" required type="date" value={targetDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Color</label>
              <input type="color" value={color} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)} className="w-full h-10 rounded border border-[var(--color-border-primary)] cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {goal && (
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-lg text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:bg-[var(--color-danger-muted)] mr-auto" onClick={() => deleteMutation.mutate(goal.id, { onSuccess: onClose })}>
                Delete
              </button>
            )}
            <button type="button" className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border-primary)]" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] hover:bg-[var(--color-accent-secondary)] disabled:opacity-50" disabled={createMutation.isPending || updateMutation.isPending}>
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
