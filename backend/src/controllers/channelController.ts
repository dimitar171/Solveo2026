import { Request, Response } from 'express';
import channelService from '../services/channelService';

export class ChannelController {
  /**
   * Get channel data with filters
   * GET /api/channels?channel=Organic Search&month=2025-01
   */
  async getChannelData(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        channel: req.query.channel as string | undefined,
        month: req.query.month as string | undefined
      };

      const data = await channelService.getChannelData(filters);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get channel comparison
   * GET /api/channels/comparison
   */
  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const data = await channelService.getChannelComparison();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get low-performing channels
   * GET /api/channels/low-performing
   */
  async getLowPerforming(req: Request, res: Response): Promise<void> {
    try {
      const data = await channelService.getLowPerformingChannels();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get list of channels
   * GET /api/channels/list
   */
  async getChannels(req: Request, res: Response): Promise<void> {
    try {
      const data = await channelService.getChannels();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get channel trends
   * GET /api/channels/trends?channel=Organic Search
   */
  async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const channel = req.query.channel as string;
      
      if (!channel) {
        res.status(400).json({ success: false, error: 'Channel parameter is required' });
        return;
      }

      const data = await channelService.getChannelTrends(channel);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new ChannelController();
