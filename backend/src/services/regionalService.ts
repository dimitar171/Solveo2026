import { prisma } from '../models';

export class RegionalService {
  /**
   * Get regional performance data with optional filters
   */
  async getRegionalData(filters?: {
    region?: string;
    country?: string;
    city?: string;
    month?: string;
  }) {
    const where: any = {};

    if (filters?.region) where.region = filters.region;
    if (filters?.country) where.country = filters.country;
    if (filters?.city) where.city = filters.city;
    if (filters?.month) where.month = filters.month;

    return await prisma.regionalPerformance.findMany({
      where,
      orderBy: [
        { month: 'desc' },
        { mrrUsd: 'desc' }
      ]
    });
  }

  /**
   * Get regional breakdown (aggregated by region)
   */
  async getRegionalBreakdown() {
    const regions = await prisma.regionalPerformance.groupBy({
      by: ['region'],
      _sum: {
        totalTraffic: true,
        trialsStarted: true,
        paidConversions: true,
        mrrUsd: true
      },
      _avg: {
        trialToPaidRate: true,
        cacUsd: true,
        ltvUsd: true
      }
    });

    return regions.map(r => ({
      region: r.region,
      totalTraffic: r._sum.totalTraffic || 0,
      trialsStarted: r._sum.trialsStarted || 0,
      paidConversions: r._sum.paidConversions || 0,
      mrr: r._sum.mrrUsd || 0,
      avgTrialToPaidRate: r._avg.trialToPaidRate || 0,
      avgCAC: r._avg.cacUsd || 0,
      avgLTV: r._avg.ltvUsd || 0
    }));
  }

  /**
   * Get country breakdown for a specific region
   */
  async getCountryBreakdown(region: string) {
    const countries = await prisma.regionalPerformance.groupBy({
      by: ['country'],
      where: { region },
      _sum: {
        totalTraffic: true,
        paidConversions: true,
        mrrUsd: true
      },
      _avg: {
        trialToPaidRate: true
      }
    });

    return countries.map(c => ({
      country: c.country,
      totalTraffic: c._sum.totalTraffic || 0,
      paidConversions: c._sum.paidConversions || 0,
      mrr: c._sum.mrrUsd || 0,
      avgConversion: c._avg.trialToPaidRate || 0
    }));
  }

  /**
   * Get city breakdown for a specific country
   */
  async getCityBreakdown(country: string) {
    const cities = await prisma.regionalPerformance.groupBy({
      by: ['city'],
      where: { country },
      _sum: {
        totalTraffic: true,
        paidConversions: true,
        mrrUsd: true
      },
      _avg: {
        trialToPaidRate: true,
        cacUsd: true
      }
    });

    return cities.map(c => ({
      city: c.city,
      totalTraffic: c._sum.totalTraffic || 0,
      paidConversions: c._sum.paidConversions || 0,
      mrr: c._sum.mrrUsd || 0,
      avgConversion: c._avg.trialToPaidRate || 0,
      avgCAC: c._avg.cacUsd || 0
    }));
  }

  /**
   * Get underperforming regions
   */
  async getUnderperformingRegions() {
    const regions = await prisma.regionalPerformance.groupBy({
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

    return regions.map(r => ({
      region: r.region,
      avgConversion: r._avg.trialToPaidRate || 0,
      avgCAC: r._avg.cacUsd || 0,
      issues: [
        r._avg.trialToPaidRate && r._avg.trialToPaidRate < 12 ? 'Low conversion' : null,
        r._avg.cacUsd && r._avg.cacUsd > 150 ? 'High CAC' : null
      ].filter(Boolean)
    }));
  }

  /**
   * Get list of all regions
   */
  async getRegions() {
    const regions = await prisma.regionalPerformance.groupBy({
      by: ['region']
    });

    return regions.map(r => r.region);
  }

  /**
   * Get list of countries for a region
   */
  async getCountries(region?: string) {
    const where = region ? { region } : {};
    
    const countries = await prisma.regionalPerformance.groupBy({
      by: ['country'],
      where
    });

    return countries.map(c => c.country);
  }

  /**
   * Get list of cities for a country
   */
  async getCities(country?: string) {
    const where = country ? { country } : {};
    
    const cities = await prisma.regionalPerformance.groupBy({
      by: ['city'],
      where
    });

    return cities.map(c => c.city);
  }
}

export default new RegionalService();
