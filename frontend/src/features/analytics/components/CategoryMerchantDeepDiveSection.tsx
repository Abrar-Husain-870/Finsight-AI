import React, { useMemo } from 'react';
import { AnalyticsSummaryResponse, TransactionResponse, fromMinor } from '@finsight/shared';
import { PatternLines } from '@visx/pattern';
import {
  BarChart,
  Bar,
  BarXAxis,
  BarYAxis,
  YAxis as CustomYAxis,
  Grid,
  ChartTooltip,
  FunnelChart
} from '../../../components/ui/charts/index.js';
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
  const categoryData = useMemo(() => {
    if (analyticsData?.categoryAnalysis && analyticsData.categoryAnalysis.length > 0) {
      return analyticsData.categoryAnalysis.map(c => ({
        browser: c.categoryName,
        users: fromMinor(c.amount),
        fill: 'var(--primary)'
      })).slice(0, 7);
    }
    return [
      { browser: 'Rent/Mortgage', users: 1800, fill: 'var(--primary)' },
      { browser: 'Groceries', users: 850, fill: 'var(--primary)' },
      { browser: 'Restaurants', users: 620, fill: 'var(--primary)' },
      { browser: 'Crypto/Stocks', users: 450, fill: 'var(--primary)' },
      { browser: 'Utilities', users: 310, fill: 'var(--primary)' },
      { browser: 'Coffee', users: 240, fill: 'var(--primary)' },
      { browser: 'Public Transit', users: 190, fill: 'var(--primary)' },
    ];
  }, [analyticsData]);

  // 2. Top Merchant Frequency & Spend (Bar Chart Data)
  const merchantData = useMemo(() => {
    if (analyticsData?.merchantAnalysis && analyticsData.merchantAnalysis.length > 0) {
      return analyticsData.merchantAnalysis.map(m => ({
        browser: m.merchant.toUpperCase(),
        users: fromMinor(m.amount),
        fill: 'var(--primary)'
      })).slice(0, 6);
    }
    return [
      { browser: 'AMAZON', users: 1240, fill: 'var(--primary)' },
      { browser: 'WHOLE FOODS', users: 890, fill: 'var(--primary)' },
      { browser: 'TRADER JOES', users: 540, fill: 'var(--primary)' },
      { browser: 'STARBUCKS', users: 320, fill: 'var(--primary)' },
      { browser: 'UBER', users: 210, fill: 'var(--primary)' },
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
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || '#3B82F6'
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
  const highestConcentration = categoryRiskData.length > 0 ? categoryRiskData.reduce((prev: any, curr: any) => (curr.percent > prev.percent ? curr : prev)) : null;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--chart-2)]" />
            3. Category & Merchant Deep-Dive Visualizations
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Granular breakdown across subcategories, vendor spend volume, and concentration risk monitoring.
          </p>
        </div>
        {highestConcentration && highestConcentration.percent > 35 && (
          <div className="px-3 py-1.5 rounded-xl border border-[var(--chart-2)]/20 bg-[var(--chart-2)]/10 text-xs font-semibold text-[var(--chart-2)] flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Risk: {highestConcentration.name} represents {highestConcentration.percent}% of total spend
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Parent Category vs Subcategory Breakdown (Bar Chart) */}
        <WidgetContainer title="Category & Subcategory Breakdown">
          <div className="h-[260px] w-full pt-1">
            <BarChart
              data={categoryData}
              xDataKey="browser"
              orientation="horizontal"
              margin={{ top: 8, right: 16, bottom: 24, left: 100 }}
              aspectRatio="4 / 3"
            >
              <Grid horizontal={false} vertical fadeVertical />
              <Bar dataKey="users" lineCap={4} />
              <BarYAxis />
              <ChartTooltip showCrosshair={false} />
            </BarChart>
          </div>
        </WidgetContainer>

        {/* 2. Top Merchant Frequency & Spend (Bar Chart) */}
        <WidgetContainer title="Top Merchant Spend">
          <div className="h-[260px] w-full pt-1">
            <BarChart
              data={merchantData}
              xDataKey="browser"
              orientation="vertical"
              margin={{ top: 8, right: 8, bottom: 40, left: 45 }}
              aspectRatio="4 / 3"
            >
              <Grid horizontal vertical fadeVertical />
              <Bar dataKey="users" lineCap={4} />
              <BarXAxis />
              <CustomYAxis />
              <ChartTooltip showCrosshair={false} />
            </BarChart>
          </div>
        </WidgetContainer>
      </div>

      {/* 3. Category Concentration Risk (Funnel Chart) */}
      <WidgetContainer title="Category Concentration Risk">
        <div className="h-[260px] w-full flex items-center justify-center pt-2">
          <FunnelChart
            color="var(--chart-2)"
            data={categoryRiskData}
            layers={3}
            renderPattern={(id, color) => (
              <PatternLines
                background={color}
                height={8}
                id={id}
                orientation={["diagonal"]}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={2}
                width={8}
              />
            )}
          />
        </div>
      </WidgetContainer>
    </div>
  );
}
