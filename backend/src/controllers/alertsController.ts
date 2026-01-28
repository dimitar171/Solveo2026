import { Request, Response } from 'express';
import alertsService from '../services/alertsService';

export class AlertsController {
  /**
   * Get all alerts
   * GET /api/alerts
   */
  async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await alertsService.detectAnomalies();
      res.json({ success: true, alerts });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get Q3 dip alert
   * GET /api/alerts/q3-dip
   */
  async getQ3Dip(req: Request, res: Response): Promise<void> {
    try {
      const alert = await alertsService.detectQ3Dip();
      res.json({ success: true, alert });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new AlertsController();
