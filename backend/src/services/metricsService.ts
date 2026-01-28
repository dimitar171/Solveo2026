import { prisma } from '../models';

export class MetricsService {
  /**
   * Get executive summary with key metrics
   */
  async getExecutiveSummary() {
    // Get latest month data
    const latestMonth = await prisma.monthlyMetric.findFirst({
      orderBy: { month: 'desc' }
    });

    if (!latestMonth) {
      throw new Error('No monthly data available');
    }

    // Get previous month for comparison
    const allMonths = await prisma.monthlyMetric.findMany({
      orderBy: { month: 'desc' },
      take: 2
    });

    const previousMonth = allMonths[1];

    // Calculate growth rates
    const mrrGrowth = previousMonth 
      ? ((latestMonth.mrrUsd - previousMonth.mrrUsd) / previousMonth.mrrUsd * 100)
      : 0;

    const signupGrowth = previousMonth
      ? ((latestMonth.uniqueSignups - previousMonth.uniqueSignups) / previousMonth.uniqueSignups * 100)
      : 0;

    // Get top regions by MRR
    const topRegions = await prisma.regionalPerformance.groupBy({
      by: ['region'],
      _sum: {
        mrrUsd: true,
        paidConversions: true
      },
      orderBy: {
        _sum: {
          mrrUsd: 'desc'
        }
      },
      take: 5
    });

    // Get total counts
    const totalKeywords = await prisma.keyword.count();
    const totalRegions = await prisma.regionalPerformance.groupBy({
      by: ['region']
    });

    return {
      currentMonth: latestMonth.month,
      mrr: {
        current: latestMonth.mrrUsd,
        growth: mrrGrowth,
        previous: previousMonth?.mrrUsd || 0
      },
      signups: {
        current: latestMonth.uniqueSignups,
        growth: signupGrowth,
        previous: previousMonth?.uniqueSignups || 0
      },
      churnRate: latestMonth.churnRate,
      conversionRates: {
        signupToTrial: latestMonth.signupToTrialRate,
        trialToPaid: latestMonth.trialToPaidRate
      },
      topRegions: topRegions.map(r => ({
        region: r.region,
        mrr: r._sum.mrrUsd || 0,
        conversions: r._sum.paidConversions || 0
      })),
      totals: {
        keywords: totalKeywords,
        regions: totalRegions.length
      }
    };
  }

  /**
   * Get trend data for charts
   */
  async getTrends(metric: string = 'mrr', period: number = 12) {
    const validMetrics = ['mrr', 'signups', 'traffic', 'churn', 'conversions'];
    
    if (!validMetrics.includes(metric)) {
      throw new Error(`Invalid metric. Must be one of: ${validMetrics.join(', ')}`);
    }

    const data = await prisma.monthlyMetric.findMany({
      orderBy: { month: 'asc' },
      take: period
    });

    const metricMap: { [key: string]: (row: any) => number } = {
      mrr: (row) => row.mrrUsd,
      signups: (row) => row.uniqueSignups,
      traffic: (row) => row.websiteTraffic,
      churn: (row) => row.churnRate * 100,
      conversions: (row) => row.paidConversions
    };

    return data.map(row => ({
      month: row.month,
      value: metricMap[metric](row)
    }));
  }

  /**
   * Get funnel data for conversion visualization
   */
  async getFunnelData(month?: string) {
    let monthData;

    if (month) {
      monthData = await prisma.monthlyMetric.findFirst({
        where: { month }
      });
    } else {
      monthData = await prisma.monthlyMetric.findFirst({
        orderBy: { month: 'desc' }
      });
    }

    if (!monthData) {
      throw new Error('No data available for the specified month');
    }

    const stages = [
      {
        name: 'Traffic',
        value: monthData.websiteTraffic,
        percentage: 100,
        dropoff: null,
        conversionFromPrevious: null
      },
      {
        name: 'Signup',
        value: monthData.uniqueSignups,
        percentage: (monthData.uniqueSignups / monthData.websiteTraffic * 100),
        dropoff: monthData.websiteTraffic - monthData.uniqueSignups,
        conversionFromPrevious: (monthData.uniqueSignups / monthData.websiteTraffic * 100)
      },
      {
        name: 'Trial',
        value: monthData.trialsStarted,
        percentage: (monthData.trialsStarted / monthData.websiteTraffic * 100),
        dropoff: monthData.uniqueSignups - monthData.trialsStarted,
        conversionFromPrevious: monthData.signupToTrialRate
      },
      {
        name: 'Paid',
        value: monthData.paidConversions,
        percentage: (monthData.paidConversions / monthData.websiteTraffic * 100),
        dropoff: monthData.trialsStarted - monthData.paidConversions,
        conversionFromPrevious: monthData.trialToPaidRate
      }
    ];

    return {
      month: monthData.month,
      stages,
      overallConversion: (monthData.paidConversions / monthData.websiteTraffic * 100)
    };
  }

  /**
   * Get all available months
   */
  async getAvailableMonths() {
    const months = await prisma.monthlyMetric.findMany({
      select: { month: true },
      orderBy: { month: 'desc' }
    });

    return months.map(m => m.month);
  }
}

export default new MetricsService();
