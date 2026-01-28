import * as cron from 'node-cron';
import dataImporter from './dataImporter';
import path from 'path';
import fs from 'fs';

interface SchedulerConfig {
  enabled: boolean;
  cronExpression: string;
  dataFilePath: string;
}

class Scheduler {
  private task: cron.ScheduledTask | null = null;
  private config: SchedulerConfig;

  constructor() {
    // Default configuration
    this.config = {
      enabled: process.env.SCHEDULER_ENABLED === 'true',
      cronExpression: process.env.CRON_EXPRESSION || '0 2 * * *', // Default: 2 AM daily
      dataFilePath: process.env.DATA_FILE_PATH || path.join(__dirname, '../../uploads/ai_coding_agent_dashboard_data.xlsx')
    };
  }

  /**
   * Start the scheduled data import
   */
  start(): void {
    if (!this.config.enabled) {
      console.log('⏸️  Scheduler is disabled. Set SCHEDULER_ENABLED=true to enable.');
      return;
    }

    if (this.task) {
      console.log('⚠️  Scheduler is already running');
      return;
    }

    console.log(`⏰ Starting scheduler with cron expression: ${this.config.cronExpression}`);
    console.log(`📁 Data file path: ${this.config.dataFilePath}`);

    this.task = cron.schedule(this.config.cronExpression, async () => {
      console.log(`\n🔄 [${new Date().toISOString()}] Running scheduled data import...`);
      
      try {
        // Check if file exists
        if (!fs.existsSync(this.config.dataFilePath)) {
          console.error(`❌ Data file not found: ${this.config.dataFilePath}`);
          return;
        }

        // Run import
        const result = await dataImporter.importExcelFile(this.config.dataFilePath);
        console.log(`✅ Scheduled import completed: ${result.recordCount} records imported`);
        
        // TODO: Send notification (email, Slack, etc.)
        // await this.sendNotification('success', result);
        
      } catch (error) {
        console.error('❌ Scheduled import failed:', error);
        
        // TODO: Send error notification
        // await this.sendNotification('error', error);
      }
    });

    console.log('✅ Scheduler started successfully');
  }

  /**
   * Stop the scheduled task
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️  Scheduler stopped');
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): { enabled: boolean; cronExpression: string; isRunning: boolean; dataFilePath: string } {
    return {
      enabled: this.config.enabled,
      cronExpression: this.config.cronExpression,
      isRunning: this.task !== null,
      dataFilePath: this.config.dataFilePath
    };
  }

  /**
   * Update scheduler configuration
   */
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart if running
    if (this.task) {
      this.stop();
      this.start();
    }
  }

  /**
   * Trigger manual import (outside of schedule)
   */
  async triggerManualImport(): Promise<any> {
    console.log('🔄 Triggering manual import...');
    
    if (!fs.existsSync(this.config.dataFilePath)) {
      throw new Error(`Data file not found: ${this.config.dataFilePath}`);
    }

    return await dataImporter.importExcelFile(this.config.dataFilePath);
  }

  /**
   * Validate cron expression
   */
  validateCronExpression(expression: string): boolean {
    return cron.validate(expression);
  }

  /**
   * Get human-readable description of cron schedule
   */
  describeCronExpression(expression: string): string {
    const descriptions: { [key: string]: string } = {
      '* * * * *': 'Every minute',
      '*/5 * * * *': 'Every 5 minutes',
      '0 * * * *': 'Every hour',
      '0 */6 * * *': 'Every 6 hours',
      '0 0 * * *': 'Daily at midnight',
      '0 2 * * *': 'Daily at 2 AM',
      '0 0 * * 0': 'Weekly on Sunday at midnight',
      '0 0 1 * *': 'Monthly on the 1st at midnight'
    };

    return descriptions[expression] || 'Custom schedule';
  }
}

export default new Scheduler();
