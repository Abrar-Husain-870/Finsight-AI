import React, { useState, useEffect } from 'react';
import { useRunSimulation } from '../features/simulation/hooks/useSimulation.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { Calculator, ArrowRight, Target, Activity, DollarSign, RefreshCw } from 'lucide-react';
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
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-[1200px] mx-auto w-full gap-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Simulation</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Adjust your income or expenses to see deterministic projections on your health and goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
        <div className="md:col-span-1 flex flex-col gap-8">
          <div className="flex flex-col gap-6 p-6 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]/30 border border-[var(--color-border-primary)]/30 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">Scenario Controls</h3>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 group">
                <label className="text-sm font-medium text-[var(--color-text-primary)] flex justify-between items-end">
                  <span>Income Shift</span>
                  <span className={cn("text-lg font-bold tabular-nums tracking-tight transition-colors", 
                    parseFloat(incomeAdjStr) > 0 ? "text-[var(--color-success)]" : 
                    parseFloat(incomeAdjStr) < 0 ? "text-[var(--color-danger)]" : 
                    "text-[var(--color-text-secondary)]"
                  )}>
                    {parseFloat(incomeAdjStr) >= 0 ? '+' : ''}{formatMoney((parseFloat(incomeAdjStr) || 0) * 100)}
                  </span>
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="-5000" max="5000" step="50"
                    value={parseFloat(incomeAdjStr) || 0}
                    onChange={(e) => setIncomeAdjStr(e.target.value)}
                    className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-accent-primary)] [&::-moz-range-thumb]:shadow-md transition-all group-hover:[&::-webkit-slider-thumb]:scale-110"
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)]/50">
                  <span>-{formatMoney(500000).replace(/\.\d{2}$/, '')}</span>
                  <span>+{formatMoney(500000).replace(/\.\d{2}$/, '')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 group">
                <label className="text-sm font-medium text-[var(--color-text-primary)] flex justify-between items-end">
                  <span>Expense Shift</span>
                  <span className={cn("text-lg font-bold tabular-nums tracking-tight transition-colors", 
                    parseFloat(expenseAdjStr) > 0 ? "text-[var(--color-danger)]" : 
                    parseFloat(expenseAdjStr) < 0 ? "text-[var(--color-success)]" : 
                    "text-[var(--color-text-secondary)]"
                  )}>
                    {parseFloat(expenseAdjStr) > 0 ? '+' : ''}{formatMoney((parseFloat(expenseAdjStr) || 0) * 100)}
                  </span>
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="-5000" max="5000" step="50"
                    value={parseFloat(expenseAdjStr) || 0}
                    onChange={(e) => setExpenseAdjStr(e.target.value)}
                    className="w-full h-1.5 bg-[var(--color-border-primary)] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-accent-primary)] [&::-moz-range-thumb]:shadow-md transition-all group-hover:[&::-webkit-slider-thumb]:scale-110"
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)]/50">
                  <span>-{formatMoney(500000).replace(/\.\d{2}$/, '')} (Save)</span>
                  <span>+{formatMoney(500000).replace(/\.\d{2}$/, '')} (Spend)</span>
                </div>
              </div>
              
              <button 
                onClick={() => { setIncomeAdjStr('0'); setExpenseAdjStr('0'); }}
                className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <RefreshCw className="h-4 w-4" /> Reset Scenario
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          {!data ? (
             <div className="flex-1 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]/20 flex items-center justify-center p-12 min-h-[400px]">
               <div className="flex flex-col items-center gap-4 text-[var(--color-text-secondary)]">
                 <Calculator className="h-10 w-10 opacity-50 animate-pulse text-[var(--color-accent-primary)]" />
                 <p className="text-sm font-medium">Calculating deterministic projections...</p>
               </div>
             </div>
          ) : (
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Projection Impact</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]/40 p-6 flex flex-col gap-6 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold text-sm relative z-10">
                    <DollarSign className="h-5 w-5 text-[var(--color-accent-primary)]" /> Cash Flow Impact
                  </div>
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Baseline</span>
                      <span className="font-semibold text-xl text-[var(--color-text-primary)] tabular-nums">{formatMoney(data.baseline.cashFlow)}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <ArrowRight className={cn("h-5 w-5 transition-colors", 
                        data.diff.cashFlow > 0 ? "text-[var(--color-success)]" : 
                        data.diff.cashFlow < 0 ? "text-[var(--color-danger)]" : 
                        "text-[var(--color-text-secondary)]/30"
                      )} />
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Projected</span>
                      <span className={cn("font-bold text-2xl tabular-nums tracking-tight", 
                        data.projected.cashFlow > data.baseline.cashFlow ? "text-[var(--color-success)]" : 
                        data.projected.cashFlow < data.baseline.cashFlow ? "text-[var(--color-danger)]" : 
                        "text-[var(--color-text-primary)]"
                      )}>
                        {formatMoney(data.projected.cashFlow)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="min-h-[28px] relative z-10">
                    {data.diff.cashFlow !== 0 && (
                      <div className={cn("text-xs font-bold px-3 py-1.5 rounded-full inline-flex", 
                        data.diff.cashFlow > 0 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : 
                        "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                      )}>
                        {data.diff.cashFlow > 0 ? '+' : ''}{formatMoney(data.diff.cashFlow)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]/40 p-6 flex flex-col gap-6 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold text-sm relative z-10">
                    <Activity className="h-5 w-5 text-[var(--color-accent-primary)]" /> Health Score Impact
                  </div>
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Baseline</span>
                      <span className="font-semibold text-xl text-[var(--color-text-primary)] tabular-nums">{data.baseline.healthScore}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <ArrowRight className={cn("h-5 w-5 transition-colors", 
                        data.diff.healthScore > 0 ? "text-[var(--color-success)]" : 
                        data.diff.healthScore < 0 ? "text-[var(--color-danger)]" : 
                        "text-[var(--color-text-secondary)]/30"
                      )} />
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Projected</span>
                      <span className={cn("font-bold text-2xl tabular-nums tracking-tight", 
                        data.projected.healthScore > data.baseline.healthScore ? "text-[var(--color-success)]" : 
                        data.projected.healthScore < data.baseline.healthScore ? "text-[var(--color-danger)]" : 
                        "text-[var(--color-text-primary)]"
                      )}>
                        {data.projected.healthScore}
                      </span>
                    </div>
                  </div>
                  
                  <div className="min-h-[28px] relative z-10">
                    {data.diff.healthScore !== 0 && (
                      <div className={cn("text-xs font-bold px-3 py-1.5 rounded-full inline-flex", 
                        data.diff.healthScore > 0 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : 
                        "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                      )}>
                        {data.diff.healthScore > 0 ? '+' : ''}{data.diff.healthScore} pts
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]/40 p-8 flex flex-col gap-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                
                <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold text-sm relative z-10">
                  <Target className="h-5 w-5 text-[var(--color-accent-primary)]" /> Goal Feasibility Shift
                </div>
                
                <div className="flex justify-between items-center py-4 relative z-10">
                  <div className="flex flex-col items-start w-1/3">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Baseline Feasibility</span>
                    <span className={cn("font-bold text-xl", 
                      data.baseline.overallFeasibility === 'UNREALISTIC' ? "text-[var(--color-danger)]" :
                      data.baseline.overallFeasibility === 'STRETCH' ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"
                    )}>{data.baseline.overallFeasibility}</span>
                  </div>
                  
                  <div className="flex justify-center w-1/3">
                    <ArrowRight className="h-8 w-8 text-[var(--color-text-secondary)] opacity-30" />
                  </div>
                  
                  <div className="flex flex-col items-end w-1/3">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Projected Feasibility</span>
                    <span className={cn("font-bold text-xl", 
                      data.projected.overallFeasibility === 'UNREALISTIC' ? "text-[var(--color-danger)]" :
                      data.projected.overallFeasibility === 'STRETCH' ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"
                    )}>{data.projected.overallFeasibility}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
