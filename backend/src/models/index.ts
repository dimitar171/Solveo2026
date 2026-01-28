import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Export Prisma client
export { prisma };

// Export Prisma types for use in controllers/services
export type {
  Keyword,
  RegionalPerformance,
  MonthlyMetric,
  ChannelPerformance,
  DataImport
} from '@prisma/client';

// Custom types for API responses
export interface ImportResult {
  success: boolean;
  recordCount: number;
  breakdown: {
    keywords: number;
    regional: number;
    monthly: number;
    channels: number;
  };
}

export interface SchedulerStatus {
  enabled: boolean;
  cronExpression: string;
  isRunning: boolean;
  dataFilePath: string;
}

export interface SchedulerConfig {
  enabled?: boolean;
  cronExpression?: string;
  dataFilePath?: string;
}
