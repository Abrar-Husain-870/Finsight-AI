
import React from 'react';
import { GoalResponse, formatMoney } from '@finsight/shared';
import { GoalProgressRing } from './GoalProgressRing.js';
import { cn } from '../../../lib/utils.js';
import { Target, Calendar, AlertCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  goal: GoalResponse;
  onClick: () => void;
}

export function GoalCard({ goal, onClick }: Props) {
  const isUnrealistic = goal.feasibility === 'UNREALISTIC';
  
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col gap-4 p-5 rounded-xl border bg-[var(--color-bg-primary)] shadow-sm cursor-pointer hover:border-blue-500 transition-colors overflow-hidden",
        isUnrealistic ? "border-red-200 dark:border-red-900/50" : "border-[var(--color-border-primary)]",
        goal.progress >= 100 ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20" : ""
      )}
    >
      {goal.progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"
        />
      )}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <GoalProgressRing progress={goal.progress} color={goal.color} />
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg text-[var(--color-text-primary)] flex items-center gap-2">
              {goal.name}
              {goal.progress >= 100 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Trophy className="h-5 w-5 text-emerald-500" />
                </motion.div>
              )}
            </h4>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-1">
              <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(goal.currentAmount)}</span>
              <span>of</span>
              <span>{formatMoney(goal.targetAmount)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
          <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1"><Calendar className="h-3 w-3"/> Target Date</span>
          <span className="font-medium text-sm text-[var(--color-text-primary)]">
            {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
          <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1"><Target className="h-3 w-3"/> Required/Mo</span>
          <span className={cn("font-medium text-sm", isUnrealistic ? "text-red-500" : "text-[var(--color-text-primary)]")}>
            {formatMoney(goal.requiredMonthlySavings)}
          </span>
        </div>
      </div>

      {isUnrealistic && goal.progress < 100 && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="h-4 w-4" />
          Goal may be unrealistic given current cash flow.
        </div>
      )}
    </motion.div>
  );
}
