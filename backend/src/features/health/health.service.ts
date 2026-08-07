
import { analyticsService } from '../analytics/analytics.service.js';
import { HealthScoreResponse, ScoreComponent, HealthRecommendation, getComponentStatus } from '@finsight/shared';
import crypto from 'crypto';

export class HealthService {
  async getScore(userId: string): Promise<HealthScoreResponse> {
    const analytics = await analyticsService.getSummary(userId);
    return this.calculateScoreFromAnalytics(analytics);
  }

  public calculateScoreFromAnalytics(analytics: import('@finsight/shared').AnalyticsSummaryResponse): HealthScoreResponse {
    const components: ScoreComponent[] = [];
    const recommendations: HealthRecommendation[] = [];

    // 1. Savings Rate (Weight: 35)
    let savingsScore = 0;
    let savingsExplanation = '';
    const savingsRate = analytics.income.total > 0 ? (analytics.cashFlow.total / analytics.income.total) * 100 : 0;
    
    if (savingsRate >= 20) {
      savingsScore = 100;
      savingsExplanation = 'You are saving 20%+ of your income, which is excellent.';
    } else if (savingsRate >= 10) {
      savingsScore = 80;
      savingsExplanation = 'You are saving between 10-20% of your income. Solid foundation.';
    } else if (savingsRate > 0) {
      savingsScore = 50;
      savingsExplanation = 'You are saving less than 10%. Consider cutting non-essential expenses.';
      recommendations.push({ id: crypto.randomUUID(), title: 'Increase Savings Rate', description: 'Try to cut down discretionary spending to boost your savings rate above 10%.', impact: 'HIGH' });
    } else {
      savingsScore = 0;
      savingsExplanation = 'You are spending more than you earn. This depletes your reserves.';
      recommendations.push({ id: crypto.randomUUID(), title: 'Stop Negative Cash Flow', description: 'Your expenses currently exceed your income. Review your largest transactions immediately.', impact: 'HIGH' });
    }
    
    components.push({
      name: 'Savings Rate',
      score: savingsScore,
      weight: 35,
      explanation: savingsExplanation,
      status: getComponentStatus(savingsScore)
    });

    // 2. Expense Growth (Weight: 25)
    let expenseScore = 0;
    let expenseExplanation = '';
    const expenseTrend = analytics.expense.trend;

    if (expenseTrend <= 0) {
      expenseScore = 100;
      expenseExplanation = 'Your expenses are decreasing or stable. Great job!';
    } else if (expenseTrend <= 5) {
      expenseScore = 80;
      expenseExplanation = 'Slight increase in expenses, but well within normal variance.';
    } else if (expenseTrend <= 15) {
      expenseScore = 50;
      expenseExplanation = 'Expenses grew significantly compared to last month.';
      recommendations.push({ id: crypto.randomUUID(), title: 'Review Recent Spend Spikes', description: 'Your expenses grew by over 5% recently. Check if these were one-off purchases.', impact: 'MEDIUM' });
    } else {
      expenseScore = 20;
      expenseExplanation = 'Severe spike in expenses detected. High risk to financial stability.';
      recommendations.push({ id: crypto.randomUUID(), title: 'Audit Expense Growth', description: 'Your spending is growing dangerously fast. You must audit your top categories.', impact: 'HIGH' });
    }

    components.push({
      name: 'Expense Control',
      score: expenseScore,
      weight: 25,
      explanation: expenseExplanation,
      status: getComponentStatus(expenseScore)
    });

    // 3. Category Balance (Weight: 20)
    let categoryScore = 100;
    let categoryExplanation = 'Your spending is well diversified across categories.';
    
    if (analytics.categoryAnalysis.length > 0) {
      const topCat = analytics.categoryAnalysis[0];
      // topCat is potentially undefined if length > 0 passes but element is weird, but TS knows it's there.
      if (topCat && topCat.percentage > 50) {
        categoryScore = 40;
        categoryExplanation = `${topCat.categoryName} consumes over 50% of your expenses.`;
        recommendations.push({ id: crypto.randomUUID(), title: 'Diversify Spending', description: `You are highly dependent on ${topCat.categoryName} expenses. Try to balance your budget.`, impact: 'MEDIUM' });
      } else if (topCat && topCat.percentage > 35) {
        categoryScore = 75;
        categoryExplanation = `${topCat.categoryName} is your largest expense at ${Math.round(topCat.percentage)}%.`;
      }
    }

    components.push({
      name: 'Category Balance',
      score: categoryScore,
      weight: 20,
      explanation: categoryExplanation,
      status: getComponentStatus(categoryScore)
    });

    // 4. Financial Discipline (Velocity) (Weight: 20)
    let velocityScore = 100;
    let velocityExplanation = 'Your spending velocity is safely below your income threshold.';
    
    if (analytics.income.total > 0 && analytics.spendingVelocity.projectedMonthly > analytics.income.total) {
      velocityScore = 20;
      velocityExplanation = 'Your current daily spending pace will exceed your income by month end.';
      recommendations.push({ id: crypto.randomUUID(), title: 'Slow Down Spending', description: 'At your current daily burn rate, you will run out of money before the month ends.', impact: 'HIGH' });
    } else if (analytics.income.total > 0 && analytics.spendingVelocity.projectedMonthly > (analytics.income.total * 0.8)) {
      velocityScore = 70;
      velocityExplanation = 'Your spending pace leaves very little room for savings.';
    }

    components.push({
      name: 'Financial Discipline',
      score: velocityScore,
      weight: 20,
      explanation: velocityExplanation,
      status: getComponentStatus(velocityScore)
    });

    // Calculate Overall Score
    let overallScore = 0;
    let totalWeight = 0;
    components.forEach(c => {
      overallScore += (c.score * c.weight);
      totalWeight += c.weight;
    });
    overallScore = Math.round(overallScore / totalWeight);

    // Generate History based on monthlyTrends (Mocking past scores slightly to show trend)
    const history = analytics.monthlyTrends.map((t, idx) => {
      // rough historical score approximation based on historical cashflow
      let historicalScore = 70; 
      if (t.income > 0) {
        const rate = (t.income - t.expense) / t.income;
        if (rate > 0.2) historicalScore = 95;
        else if (rate > 0.1) historicalScore = 85;
        else if (rate > 0) historicalScore = 65;
        else historicalScore = 40;
      }
      // Overwrite the most recent month with the actual calculated score
      if (idx === analytics.monthlyTrends.length - 1) {
        historicalScore = overallScore;
      }
      return {
        date: t.month,
        score: historicalScore
      };
    });

    const previousScore = history.length > 1 ? history[history.length - 2]!.score : overallScore;
    const trend = overallScore - previousScore;

    return {
      overallScore,
      previousScore,
      trend,
      components,
      recommendations,
      history
    };
  }
}

export const healthService = new HealthService();
