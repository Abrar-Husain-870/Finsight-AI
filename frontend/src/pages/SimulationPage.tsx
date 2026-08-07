import React, { useState, useEffect } from 'react';
import { useRunSimulation } from '../features/simulation/hooks/useSimulation.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { Calculator, ArrowRight, Target, Activity, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils.js';

export default function SimulationPage() {
  const simulation = useRunSimulation();
  const { formatMoney } = useCurrency();
  
  // Raw inputs (minor units visually managed as decimals by user)
  const [incomeAdjStr, setIncomeAdjStr] = useState('0');
  const [expenseAdjStr, setExpenseAdjStr] = useState('0');

  // Debounced execution
  useEffect(() => {
    const timer = setTimeout(() => {
      const inc = Math.round((parseFloat(incomeAdjStr) || 0) * 100);
      const exp = Math.round((parseFloat(expenseAdjStr) || 0) * 100);
      simulation.mutate({ incomeAdjustment: inc, expenseAdjustment: exp });
    }, 500);
    return () => clearTimeout(timer);
  }, [incomeAdjStr, expenseAdjStr]);

  const data = simulation.data;

  return (
    <div className="flex h-full flex-col p-6 max-w-5xl mx-auto w-full gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Simulation</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Adjust your income or expenses to see deterministic projections on your health and goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <WidgetContainer title="Scenario Controls">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)] flex justify-between">
                  Monthly Income Shift
                  <span className={parseFloat(incomeAdjStr) >= 0 ? "text-green-500" : "text-red-500"}>
                    {parseFloat(incomeAdjStr) >= 0 ? '+' : ''}{formatMoney((parseFloat(incomeAdjStr) || 0) * 100)}
                  </span>
                </label>
                <input 
                  type="range" 
                  min="-5000" max="5000" step="50"
                  value={parseFloat(incomeAdjStr) || 0}
                  onChange={(e) => setIncomeAdjStr(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                  <span>-{formatMoney(500000).replace(/\.\d{2}$/, '')}</span>
                  <span>+{formatMoney(500000).replace(/\.\d{2}$/, '')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)] flex justify-between">
                  Monthly Expense Shift
                  <span className={parseFloat(expenseAdjStr) > 0 ? "text-red-500" : parseFloat(expenseAdjStr) < 0 ? "text-green-500" : "text-gray-500"}>
                    {parseFloat(expenseAdjStr) > 0 ? '+' : ''}{formatMoney((parseFloat(expenseAdjStr) || 0) * 100)}
                  </span>
                </label>
                <input 
                  type="range" 
                  min="-5000" max="5000" step="50"
                  value={parseFloat(expenseAdjStr) || 0}
                  onChange={(e) => setExpenseAdjStr(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                  <span>-{formatMoney(500000).replace(/\.\d{2}$/, '')} (Save more)</span>
                  <span>+{formatMoney(500000).replace(/\.\d{2}$/, '')} (Spend more)</span>
                </div>
              </div>
              
              <button 
                onClick={() => { setIncomeAdjStr('0'); setExpenseAdjStr('0'); }}
                className="w-full py-2 text-sm font-medium rounded-lg border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
              >
                Reset Scenario
              </button>
            </div>
          </WidgetContainer>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {!data ? (
             <div className="flex-1 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm flex items-center justify-center p-12">
               <div className="flex flex-col items-center gap-4 text-[var(--color-text-secondary)]">
                 <Calculator className="h-10 w-10 opacity-50 animate-pulse" />
                 <p className="text-sm">Calculating deterministic projections...</p>
               </div>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium text-sm">
                    <DollarSign className="h-4 w-4" /> Cash Flow Impact
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--color-text-secondary)]">Baseline</span>
                      <span className="font-semibold text-lg text-[var(--color-text-primary)]">{formatMoney(data.baseline.cashFlow)}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--color-text-secondary)] opacity-50" />
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-[var(--color-text-secondary)]">Projected</span>
                      <span className={cn("font-bold text-xl", data.projected.cashFlow > data.baseline.cashFlow ? "text-green-500" : data.projected.cashFlow < data.baseline.cashFlow ? "text-red-500" : "text-[var(--color-text-primary)]")}>
                        {formatMoney(data.projected.cashFlow)}
                      </span>
                    </div>
                  </div>
                  {data.diff.cashFlow !== 0 && (
                    <div className={cn("text-xs font-medium px-2 py-1 rounded-full self-start", data.diff.cashFlow > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {data.diff.cashFlow > 0 ? '+' : ''}{formatMoney(data.diff.cashFlow)}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium text-sm">
                    <Activity className="h-4 w-4" /> Health Score Impact
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--color-text-secondary)]">Baseline</span>
                      <span className="font-semibold text-lg text-[var(--color-text-primary)]">{data.baseline.healthScore}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--color-text-secondary)] opacity-50" />
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-[var(--color-text-secondary)]">Projected</span>
                      <span className={cn("font-bold text-xl", data.projected.healthScore > data.baseline.healthScore ? "text-green-500" : data.projected.healthScore < data.baseline.healthScore ? "text-red-500" : "text-[var(--color-text-primary)]")}>
                        {data.projected.healthScore}
                      </span>
                    </div>
                  </div>
                  {data.diff.healthScore !== 0 && (
                    <div className={cn("text-xs font-medium px-2 py-1 rounded-full self-start", data.diff.healthScore > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {data.diff.healthScore > 0 ? '+' : ''}{data.diff.healthScore} pts
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] font-medium text-sm">
                  <Target className="h-4 w-4" /> Goal Feasibility Shift
                </div>
                <div className="flex justify-between items-center px-4 py-6 bg-[var(--color-bg-secondary)] rounded-lg">
                  <span className={cn("font-bold text-lg", 
                    data.baseline.overallFeasibility === 'UNREALISTIC' ? "text-red-500" :
                    data.baseline.overallFeasibility === 'STRETCH' ? "text-yellow-500" : "text-green-500"
                  )}>{data.baseline.overallFeasibility}</span>
                  
                  <ArrowRight className="h-6 w-6 text-[var(--color-text-secondary)] opacity-50" />
                  
                  <span className={cn("font-bold text-lg", 
                    data.projected.overallFeasibility === 'UNREALISTIC' ? "text-red-500" :
                    data.projected.overallFeasibility === 'STRETCH' ? "text-yellow-500" : "text-green-500"
                  )}>{data.projected.overallFeasibility}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
