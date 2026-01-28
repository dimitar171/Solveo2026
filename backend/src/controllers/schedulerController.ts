import { Request, Response } from 'express';
import scheduler from '../services/scheduler';

export class SchedulerController {
  /**
   * Get scheduler status
   * GET /api/scheduler/status
   */
  getStatus(req: Request, res: Response): void {
    const status = scheduler.getStatus();
    res.json({ success: true, ...status });
  }

  /**
   * Start the scheduler
   * POST /api/scheduler/start
   */
  start(req: Request, res: Response): void {
    try {
      scheduler.start();
      res.json({ success: true, message: 'Scheduler started' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Stop the scheduler
   * POST /api/scheduler/stop
   */
  stop(req: Request, res: Response): void {
    try {
      scheduler.stop();
      res.json({ success: true, message: 'Scheduler stopped' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Trigger manual import
   * POST /api/scheduler/trigger
   */
  async trigger(req: Request, res: Response): Promise<void> {
    try {
      const result = await scheduler.triggerManualImport();
      res.json({ success: true, message: 'Manual import triggered', ...result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Update scheduler configuration
   * POST /api/scheduler/config
   */
  updateConfig(req: Request, res: Response): void {
    try {
      const { cronExpression, dataFilePath, enabled } = req.body;
      
      if (cronExpression && !scheduler.validateCronExpression(cronExpression)) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid cron expression' 
        });
        return;
      }
      
      scheduler.updateConfig({ cronExpression, dataFilePath, enabled });
      res.json({ success: true, message: 'Scheduler configuration updated' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new SchedulerController();
