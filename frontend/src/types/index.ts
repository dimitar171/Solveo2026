// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Import types
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

export interface DataImport {
  id: number;
  filename: string;
  status: 'success' | 'failed' | 'processing';
  recordCount: number | null;
  errorMsg: string | null;
  importedAt: string;
}

// Scheduler types
export interface SchedulerStatus {
  enabled: boolean;
  cronExpression: string;
  isRunning: boolean;
  dataFilePath: string;
}

export interface SchedulerConfig {
  cronExpression?: string;
  dataFilePath?: string;
  enabled?: boolean;
}

// Metrics types
export interface ExecutiveSummary {
  currentMonth: string;
  mrr: {
    current: number;
    growth: number;
    previous: number;
  };
  signups: {
    current: number;
    growth: number;
    previous: number;
  };
  churnRate: number;
  conversionRates: {
    signupToTrial: number;
    trialToPaid: number;
  };
  topRegions: Array<{
    region: string;
    mrr: number;
    conversions: number;
  }>;
  totals: {
    keywords: number;
    regions: number;
  };
}

export interface TrendData {
  month: string;
  value: number;
}

export interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  dropoff: number | null;
  conversionFromPrevious: number | null;
}

export interface FunnelData {
  month: string;
  stages: FunnelStage[];
  overallConversion: number;
}

// Keyword types
export interface Keyword {
  id: number;
  keyword: string;
  category: string;
  traffic2024: number;
  traffic2025: number;
  trafficChangePct: number;
  position2024: number;
  position2025: number;
  positionChange: number;
  signups2024: number;
  signups2025: number;
  conversionRate2024: number;
  conversionRate2025: number;
  aiOverviewTriggered: boolean;
  difficultyScore: number;
  cpcUsd: number;
}

export interface KeywordCategory {
  category: string;
  count: number;
}

export interface KeywordStats {
  total: number;
  avgConversion: number;
  totalTraffic: number;
  aiOverviewCount: number;
}

// Regional types
export interface RegionalPerformance {
  id: number;
  region: string;
  country: string;
  city: string;
  month: string;
  organicTraffic: number;
  paidTraffic: number;
  totalTraffic: number;
  trialsStarted: number;
  paidConversions: number;
  trialToPaidRate: number;
  mrrUsd: number;
  cacUsd: number;
  ltvUsd: number;
}

export interface RegionalBreakdown {
  region: string;
  totalTraffic: number;
  trialsStarted: number;
  paidConversions: number;
  mrr: number;
  avgTrialToPaidRate: number;
  avgCAC: number;
  avgLTV: number;
}

export interface UnderperformingRegion {
  region: string;
  avgConversion: number;
  avgCAC: number;
  issues: string[];
}

export interface CountryBreakdown {
  country: string;
  totalTraffic: number;
  paidConversions: number;
  mrr: number;
  avgConversion: number;
}

export interface CityBreakdown {
  city: string;
  totalTraffic: number;
  paidConversions: number;
  mrr: number;
  avgConversion: number;
  avgCAC: number;
}

// Channel types
export interface ChannelPerformance {
  id: number;
  month: string;
  channel: string;
  sessions: number;
  signups: number;
  conversionRate: number;
  avgSessionDurationSec: number;
  bounceRate: number;
  pagesPerSession: number;
}

export interface ChannelComparison {
  channel: string;
  totalSessions: number;
  totalSignups: number;
  avgConversion: number;
  avgBounceRate: number;
  avgSessionDuration: number;
}

export interface ChannelTrend {
  month: string;
  sessions: number;
  signups: number;
  conversionRate: number;
}
