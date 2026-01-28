import { Request, Response } from 'express';
import metricsService from '../services/metricsService';

export class MetricsController {
  /**
   * Get executive summary
   * GET /api/metrics/summary
   */
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const data = await metricsService.getExecutiveSummary();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get trend data
   * GET /api/metrics/trends?metric=mrr&period=12
   */
  async getTrends(req: Request, res: Response): Promise<void> {
    try {
      const metric = req.query.metric as string || 'mrr';
      const period = parseInt(req.query.period as string) || 12;

      const data = await metricsService.getTrends(metric, period);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get funnel data
   * GET /api/metrics/funnel?month=2025-01
   */
  async getFunnel(req: Request, res: Response): Promise<void> {
    try {
      const month = req.query.month as string | undefined;
      const data = await metricsService.getFunnelData(month);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get available months
   * GET /api/metrics/months
   */
  async getMonths(req: Request, res: Response): Promise<void> {
    try {
      const data = await metricsService.getAvailableMonths();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new MetricsController();
