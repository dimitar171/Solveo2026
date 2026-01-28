import { prisma } from '../models';

export interface Alert {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  count?: number;
  details?: any[];
  value?: number;
}

export class AlertsService {
  /**
   * Detect all anomalies and return alerts
   */
  async detectAnomalies(): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Run all detection methods
    const [
      lowConversionAlert,
      aiOverviewAlert,
      regionalAlert,
      churnAlert,
      socialChannelsAlert
    ] = await Promise.all([
      this.detectLowConversionKeywords(),
      this.detectAIOverviewImpact(),
      this.detectRegionalUnderperformance(),
      this.detectChurnSpike(),
      this.detectSocialChannelWaste()
    ]);

    if (lowConversionAlert) alerts.push(lowConversionAlert);
    if (aiOverviewAlert) alerts.push(aiOverviewAlert);
    if (regionalAlert) alerts.push(regionalAlert);
    if (churnAlert) alerts.push(churnAlert);
    if (socialChannelsAlert) alerts.push(socialChannelsAlert);

    return alerts;
  }

  /**
   * Detect high traffic, low conversion keywords
   */
  private async detectLowConversionKeywords(): Promise<Alert | null> {
    const problemKeywords = await prisma.keyword.findMany({
      where: {
        traffic2025: { gte: 2000 },
        conversionRate2025: { lte: 1.5 }
      },
      orderBy: { traffic2025: 'desc' },
      take: 5
    });

    if (problemKeywords.length === 0) return null;

    const totalCount = await prisma.keyword.count({
      where: {
        traffic2025: { gte: 2000 },
        conversionRate2025: { lte: 1.5 }
      }
    });

    return {
      type: 'low_conversion_keywords',
      severity: 'critical',
      title: 'High Traffic, Low Conversion Keywords',
      message: `${totalCount} keywords with 2,000+ visits but <1.5% conversion rate`,
      count: totalCount,
      details: problemKeywords.map(k => ({
        keyword: k.keyword,
        traffic: k.traffic2025,
        conversion: k.conversionRate2025
      }))
    };
  }

  /**
   * Detect AI Overview cannibalization
   */
  private async detectAIOverviewImpact(): Promise<Alert | null> {
    const affectedKeywords = await prisma.keyword.findMany({
      where: {
        aiOverviewTriggered: true,
        trafficChangePct: { lt: -10 }
      },
      orderBy: { trafficChangePct: 'asc' },
      take: 5
    });

    if (affectedKeywords.length === 0) return null;

    const totalCount = await prisma.keyword.count({
      where: {
        aiOverviewTriggered: true,
        trafficChangePct: { lt: -10 }
      }
    });

    return {
      type: 'ai_overview_impact',
      severity: 'medium',
      title: 'AI Overview Cannibalization',
      message: `${totalCount} keywords losing traffic to Google's AI Overview`,
      count: totalCount,
      details: affectedKeywords.map(k => ({
        keyword: k.keyword,
        trafficChange: k.trafficChangePct
      }))
    };
  }

  /**
   * Detect regional underperformance
   */
  private async detectRegionalUnderperformance(): Promise<Alert | null> {
    const underperformingRegions = await prisma.regionalPerformance.groupBy({
      by: ['region'],
      _avg: {
        trialToPaidRate: true,
        cacUsd: true
      },
      having: {
        OR: [
          { trialToPaidRate: { _avg: { lt: 12 } } },
          { cacUsd: { _avg: { gt: 150 } } }
        ]
      }
    });

    if (underperformingRegions.length === 0) return null;

    return {
      type: 'regional_underperformance',
      severity: 'high',
      title: 'Underperforming Regions',
      message: `${underperformingRegions.length} regions with poor conversion or high CAC`,
      count: underperformingRegions.length,
      details: underperformingRegions.map(r => ({
        region: r.region,
        avgConversion: r._avg.trialToPaidRate,
        avgCAC: r._avg.cacUsd
      }))
    };
  }

  /**
   * Detect churn spike
   */
  private async detectChurnSpike(): Promise<Alert | null> {
    const recentMonths = await prisma.monthlyMetric.findMany({
      orderBy: { month: 'desc' },
      take: 3,
      select: { month: true, churnRate: true }
    });

    if (recentMonths.length === 0) return null;

    const avgChurn = recentMonths.reduce((sum, m) => sum + m.churnRate, 0) / recentMonths.length;

    if (avgChurn > 0.05) {
      return {
        type: 'churn_spike',
        severity: 'critical',
        title: 'High Churn Rate',
        message: `Churn rate at ${(avgChurn * 100).toFixed(2)}% (above 5% threshold)`,
        value: avgChurn * 100
      };
    }

    return null;
  }

  /**
   * Detect social channel waste
   */
  private async detectSocialChannelWaste(): Promise<Alert | null> {
    const socialChannels = await prisma.channelPerformance.groupBy({
      by: ['channel'],
      where: {
        OR: [
          { channel: 'Social (Organic)' },
          { channel: 'Social (Paid)' }
        ]
      },
      _avg: {
        conversionRate: true
      },
      _sum: {
        sessions: true
      }
    });

    const lowPerforming = socialChannels.filter(c => 
      (c._avg.conversionRate || 0) < 2
    );

    if (lowPerforming.length === 0) return null;

    const totalSessions = lowPerforming.reduce((sum, c) => sum + (c._sum.sessions || 0), 0);

    return {
      type: 'social_channel_waste',
      severity: 'high',
      title: 'Social Channels Underperforming',
      message: `Social channels have <2% conversion rate with ${totalSessions.toLocaleString()} sessions`,
      count: lowPerforming.length,
      details: lowPerforming.map(c => ({
        channel: c.channel,
        avgConversion: c._avg.conversionRate,
        totalSessions: c._sum.sessions
      }))
    };
  }

  /**
   * Detect Q3 2025 dip
   */
  async detectQ3Dip(): Promise<Alert | null> {
    const q3Months = ['2025-07', '2025-08', '2025-09'];
    const q2Months = ['2025-04', '2025-05', '2025-06'];

    const q3Data = await prisma.monthlyMetric.findMany({
      where: { month: { in: q3Months } }
    });

    const q2Data = await prisma.monthlyMetric.findMany({
      where: { month: { in: q2Months } }
    });

    if (q3Data.length === 0 || q2Data.length === 0) return null;

    const q3AvgTraffic = q3Data.reduce((sum, m) => sum + m.websiteTraffic, 0) / q3Data.length;
    const q2AvgTraffic = q2Data.reduce((sum, m) => sum + m.websiteTraffic, 0) / q2Data.length;

    const decline = ((q3AvgTraffic - q2AvgTraffic) / q2AvgTraffic) * 100;

    if (decline < -10) {
      return {
        type: 'q3_dip',
        severity: 'medium',
        title: 'Q3 2025 Traffic Dip',
        message: `Q3 2025 traffic down ${Math.abs(decline).toFixed(1)}% vs Q2`,
        value: decline
      };
    }

    return null;
  }
}

export default new AlertsService();
