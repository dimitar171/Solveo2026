import { prisma } from '../models';

export class ChannelService {
  /**
   * Get channel performance data
   */
  async getChannelData(filters?: {
    channel?: string;
    month?: string;
  }) {
    const where: any = {};

    if (filters?.channel) where.channel = filters.channel;
    if (filters?.month) where.month = filters.month;

    return await prisma.channelPerformance.findMany({
      where,
      orderBy: [
        { month: 'desc' },
        { conversionRate: 'desc' }
      ]
    });
  }

  /**
   * Get channel comparison (aggregated)
   */
  async getChannelComparison() {
    const channels = await prisma.channelPerformance.groupBy({
      by: ['channel'],
      _sum: {
        sessions: true,
        signups: true
      },
      _avg: {
        conversionRate: true,
        bounceRate: true,
        avgSessionDurationSec: true
      }
    });

    return channels.map(c => ({
      channel: c.channel,
      totalSessions: c._sum.sessions || 0,
      totalSignups: c._sum.signups || 0,
      avgConversion: c._avg.conversionRate || 0,
      avgBounceRate: c._avg.bounceRate || 0,
      avgSessionDuration: c._avg.avgSessionDurationSec || 0
    }));
  }

  /**
   * Get low-performing channels
   */
  async getLowPerformingChannels() {
    const channels = await prisma.channelPerformance.groupBy({
      by: ['channel'],
      _avg: {
        conversionRate: true
      },
      _sum: {
        sessions: true
      },
      having: {
        conversionRate: {
          _avg: { lt: 2 }
        }
      }
    });

    return channels.map(c => ({
      channel: c.channel,
      avgConversion: c._avg.conversionRate || 0,
      totalSessions: c._sum.sessions || 0
    }));
  }

  /**
   * Get list of all channels
   */
  async getChannels() {
    const channels = await prisma.channelPerformance.groupBy({
      by: ['channel']
    });

    return channels.map(c => c.channel);
  }

  /**
   * Get channel trends over time
   */
  async getChannelTrends(channel: string) {
    return await prisma.channelPerformance.findMany({
      where: { channel },
      orderBy: { month: 'asc' },
      select: {
        month: true,
        sessions: true,
        signups: true,
        conversionRate: true
      }
    });
  }
}

export default new ChannelService();
