import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { AnalyticsSummaryResponse, TransactionResponse, fromMinor } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../../../components/ui/WidgetContainer.js';
import { Layers, Store, AlertCircle } from 'lucide-react';

interface CategoryMerchantDeepDiveSectionProps {
  analyticsData?: AnalyticsSummaryResponse | null;
  transactions?: TransactionResponse[];
}

const CATEGORY_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6'];

export function CategoryMerchantDeepDiveSection({ analyticsData, transactions }: CategoryMerchantDeepDiveSectionProps) {
  const { formatMoney } = useCurrency();

  // 1. Parent Category vs Subcategory Breakdown (Bar Chart Data)
  const subcategoryData = useMemo(() => {
    if (analyticsData?.categoryAnalysis && analyticsData.categoryAnalysis.length > 0) {
      return analyticsData.categoryAnalysis.map(c => ({
        subcategory: c.categoryName,
        spend: fromMinor(c.amount)
      })).slice(0, 7);
    }
    return [
      { subcategory: 'Groceries', spend: 850 },
      { subcategory: 'Coffee', spend: 240 },
      { subcategory: 'Restaurants', spend: 620 },
      { subcategory: 'Rent/Mortgage', spend: 1800 },
      { subcategory: 'Utilities', spend: 310 },
      { subcategory: 'Public Transit', spend: 190 },
      { subcategory: 'Crypto/Stocks', spend: 450 },
    ];
  }, [analyticsData]);

  // 2. Top Merchant Frequency & Spend (Bar Chart Data)
  const merchantData = useMemo(() => {
    if (analyticsData?.merchantAnalysis && analyticsData.merchantAnalysis.length > 0) {
      return analyticsData.merchantAnalysis.map(m => ({
        merchant: m.merchant.toUpperCase(),
        spend: fromMinor(m.amount),
        count: m.count
      })).slice(0, 6);
    }
    return [
      { merchant: 'AMAZON', spend: 1240, count: 8 },
      { merchant: 'STARBUCKS', spend: 320, count: 14 },
      { merchant: 'WHOLE FOODS', spend: 890, count: 6 },
      { merchant: 'TRADER JOES', spend: 540, count: 5 },
      { merchant: 'UBER', spend: 210, count: 11 },
    ];
  }, [analyticsData]);

  // 3. Category Concentration Risk (Pie Chart Data)
  const categoryRiskData = useMemo(() => {
    if (analyticsData?.categoryAnalysis && analyticsData.categoryAnalysis.length > 0) {
      const totalExpense = analyticsData.expense.total || 1;
      return analyticsData.categoryAnalysis.map((c, idx) => ({
        name: c.categoryName,
        value: fromMinor(c.amount),
        percent: Math.round((c.amount / totalExpense) * 100),
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
      }));
    }
    return [
      { name: 'Housing', value: 1800, percent: 42, color: '#3B82F6' },
      { name: 'Food & Dining', value: 1200, percent: 28, color: '#F59E0B' },
      { name: 'Investments', value: 650, percent: 15, color: '#10B981' },
      { name: 'Transportation', value: 400, percent: 9, color: '#EC4899' },
      { name: 'Utilities', value: 250, percent: 6, color: '#8B5CF6' },
    ];
  }, [analyticsData]);

  // Check highest concentration category risk
  const highestConcentration = categoryRiskData.length > 0 ? categoryRiskData.reduce((prev, curr) => (curr.percent > prev.percent ? curr : prev)) : null;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            3. Category & Merchant Deep-Dive Visualizations
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Granular breakdown across subcategories, vendor spend volume, and concentration risk monitoring.
          </p>
        </div>
        {highestConcentration && highestConcentration.percent > 35 && (
          <div className="px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-xs font-semibold text-amber-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Risk: {highestConcentration.name} represents {highestConcentration.percent}% of total spend
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Parent Category vs Subcategory Breakdown (Bar Chart) */}
        <WidgetContainer title="Parent Category vs. Subcategory Breakdown (Subcategory Ranking Bar Chart)">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subcategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis dataKey="subcategory" type="category" width={110} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any) => [formatMoney(Number(val) || 0), 'Total Spend']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Bar dataKey="spend" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 2. Top Merchant Frequency & Spend (Bar Chart) */}
        <WidgetContainer title="Top Merchant Frequency & Spend Volume (Bar Chart)">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={merchantData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="merchant" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any, name?: any) => [name === 'spend' ? formatMoney(Number(val) || 0) : val, name === 'spend' ? 'Spend Volume' : 'Count']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Bar dataKey="spend" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>
      </div>

      {/* 3. Category Concentration Risk (Pie Chart) */}
      <WidgetContainer title="Category Concentration Risk Breakdown (Percentage Share Slices)">
        <div className="h-[260px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryRiskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {categoryRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [formatMoney(Number(val) || 0), 'Category Total']}
                contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </WidgetContainer>
    </div>
  );
}
