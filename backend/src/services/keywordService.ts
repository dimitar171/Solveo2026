import { prisma } from '../models';

export class KeywordService {
  /**
   * Get all keywords with optional filtering
   */
  async getKeywords(filters?: {
    category?: string;
    minTraffic?: number;
    maxConversion?: number;
    aiOverview?: boolean;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.minTraffic) {
      where.traffic2025 = { gte: filters.minTraffic };
    }

    if (filters?.maxConversion) {
      where.conversionRate2025 = { lte: filters.maxConversion };
    }

    if (filters?.aiOverview !== undefined) {
      where.aiOverviewTriggered = filters.aiOverview;
    }

    return await prisma.keyword.findMany({
      where,
      orderBy: { traffic2025: 'desc' }
    });
  }

  /**
   * Get keyword categories
   */
  async getCategories() {
    const categories = await prisma.keyword.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    return categories.map(c => ({
      category: c.category,
      count: c._count.category
    }));
  }

  /**
   * Get problem keywords (high traffic, low conversion)
   */
  async getProblemKeywords() {
    return await prisma.keyword.findMany({
      where: {
        traffic2025: { gte: 2000 },
        conversionRate2025: { lte: 1.5 }
      },
      orderBy: { traffic2025: 'desc' }
    });
  }

  /**
   * Get keywords affected by AI Overview
   */
  async getAIOverviewImpact() {
    return await prisma.keyword.findMany({
      where: {
        aiOverviewTriggered: true,
        trafficChangePct: { lt: -10 }
      },
      orderBy: { trafficChangePct: 'asc' }
    });
  }

  /**
   * Get keyword statistics
   */
  async getKeywordStats() {
    const total = await prisma.keyword.count();
    
    const avgConversion = await prisma.keyword.aggregate({
      _avg: {
        conversionRate2025: true
      }
    });

    const totalTraffic = await prisma.keyword.aggregate({
      _sum: {
        traffic2025: true
      }
    });

    const aiOverviewCount = await prisma.keyword.count({
      where: { aiOverviewTriggered: true }
    });

    return {
      total,
      avgConversion: avgConversion._avg.conversionRate2025 || 0,
      totalTraffic: totalTraffic._sum.traffic2025 || 0,
      aiOverviewCount
    };
  }
}

export default new KeywordService();
