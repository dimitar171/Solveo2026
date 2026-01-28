import * as xlsx from 'xlsx';
import { prisma, type ImportResult, type DataImport } from '../models';

class DataImporter {
  async importExcelFile(filePath: string): Promise<ImportResult> {
    console.log(`📥 Starting import from: ${filePath}`);
    
    // Create import record
    const importRecord = await prisma.dataImport.create({
      data: {
        filename: filePath,
        status: 'processing'
      }
    });

    try {
      // Read Excel file
      const workbook = xlsx.readFile(filePath);
      console.log(`📊 Workbook loaded. Sheets: ${workbook.SheetNames.join(', ')}`);
      
      // Import each sheet
      const keywordCount = await this.importKeywords(workbook);
      const regionalCount = await this.importRegionalPerformance(workbook);
      const monthlyCount = await this.importMonthlyMetrics(workbook);
      const channelCount = await this.importChannelPerformance(workbook);
      
      const totalRecords = keywordCount + regionalCount + monthlyCount + channelCount;
      
      // Update import record
      await prisma.dataImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'success',
          recordCount: totalRecords
        }
      });
      
      console.log(`✅ Import successful! Total records: ${totalRecords}`);
      
      return { 
        success: true, 
        recordCount: totalRecords,
        breakdown: {
          keywords: keywordCount,
          regional: regionalCount,
          monthly: monthlyCount,
          channels: channelCount
        }
      };
    } catch (error) {
      console.error(`❌ Import failed:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update import record with error
      await prisma.dataImport.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          errorMsg: errorMessage
        }
      });
      
      throw error;
    }
  }

  private async importKeywords(workbook: xlsx.WorkBook): Promise<number> {
    console.log('📝 Importing keywords...');
    
    const sheet = workbook.Sheets['Keyword Performance'];
    if (!sheet) {
      throw new Error('Sheet "Keyword Performance" not found');
    }
    
    const data = xlsx.utils.sheet_to_json(sheet) as any[];
    console.log(`   Found ${data.length} keyword records`);
    
    // Clear existing data
    await prisma.keyword.deleteMany();
    
    // Transform and insert
    const keywords = data.map(row => ({
      keyword: row.keyword,
      category: row.category,
      traffic2024: row.traffic_2024,
      traffic2025: row.traffic_2025,
      trafficChangePct: row.traffic_change_pct,
      position2024: row.position_2024,
      position2025: row.position_2025,
      positionChange: row.position_change,
      signups2024: row.signups_2024,
      signups2025: row.signups_2025,
      conversionRate2024: row.conversion_rate_2024,
      conversionRate2025: row.conversion_rate_2025,
      aiOverviewTriggered: row.ai_overview_triggered === 'Yes',
      difficultyScore: row.difficulty_score,
      cpcUsd: row.cpc_usd
    }));
    
    await prisma.keyword.createMany({ data: keywords });
    console.log(`   ✓ Imported ${keywords.length} keywords`);
    
    return keywords.length;
  }

  private async importRegionalPerformance(workbook: xlsx.WorkBook): Promise<number> {
    console.log('🌍 Importing regional performance...');
    
    const sheet = workbook.Sheets['Regional Performance'];
    if (!sheet) {
      throw new Error('Sheet "Regional Performance" not found');
    }
    
    const data = xlsx.utils.sheet_to_json(sheet) as any[];
    console.log(`   Found ${data.length} regional records`);
    
    // Clear existing data
    await prisma.regionalPerformance.deleteMany();
    
    // Transform and insert
    const regions = data.map(row => ({
      region: row.region,
      country: row.country,
      city: row.city,
      month: row.month,
      organicTraffic: row.organic_traffic,
      paidTraffic: row.paid_traffic,
      totalTraffic: row.total_traffic,
      trialsStarted: row.trials_started,
      paidConversions: row.paid_conversions,
      trialToPaidRate: row.trial_to_paid_rate,
      mrrUsd: row.mrr_usd,
      cacUsd: row.cac_usd,
      ltvUsd: row.ltv_usd
    }));
    
    await prisma.regionalPerformance.createMany({ data: regions });
    console.log(`   ✓ Imported ${regions.length} regional records`);
    
    return regions.length;
  }

  private async importMonthlyMetrics(workbook: xlsx.WorkBook): Promise<number> {
    console.log('📈 Importing monthly metrics...');
    
    const sheet = workbook.Sheets['Monthly Metrics'];
    if (!sheet) {
      throw new Error('Sheet "Monthly Metrics" not found');
    }
    
    const data = xlsx.utils.sheet_to_json(sheet) as any[];
    console.log(`   Found ${data.length} monthly records`);
    
    // Clear existing data
    await prisma.monthlyMetric.deleteMany();
    
    // Transform and insert
    const metrics = data.map(row => ({
      month: row.month,
      websiteTraffic: row.website_traffic,
      uniqueSignups: row.unique_signups,
      trialsStarted: row.trials_started,
      paidConversions: row.paid_conversions,
      mrrUsd: row.mrr_usd,
      churnRate: row.churn_rate,
      signupToTrialRate: row.signup_to_trial_rate,
      trialToPaidRate: row.trial_to_paid_rate,
      netNewMrr: row.net_new_mrr,
      expansionMrr: row.expansion_mrr,
      churnedMrr: row.churned_mrr
    }));
    
    await prisma.monthlyMetric.createMany({ data: metrics });
    console.log(`   ✓ Imported ${metrics.length} monthly records`);
    
    return metrics.length;
  }

  private async importChannelPerformance(workbook: xlsx.WorkBook): Promise<number> {
    console.log('📡 Importing channel performance...');
    
    const sheet = workbook.Sheets['Channel Performance'];
    if (!sheet) {
      throw new Error('Sheet "Channel Performance" not found');
    }
    
    const data = xlsx.utils.sheet_to_json(sheet) as any[];
    console.log(`   Found ${data.length} channel records`);
    
    // Clear existing data
    await prisma.channelPerformance.deleteMany();
    
    // Transform and insert
    const channels = data.map(row => ({
      month: row.month,
      channel: row.channel,
      sessions: row.sessions,
      signups: row.signups,
      conversionRate: row.conversion_rate,
      avgSessionDurationSec: row.avg_session_duration_sec,
      bounceRate: row.bounce_rate,
      pagesPerSession: row.pages_per_session
    }));
    
    await prisma.channelPerformance.createMany({ data: channels });
    console.log(`   ✓ Imported ${channels.length} channel records`);
    
    return channels.length;
  }

  async getImportHistory(): Promise<DataImport[]> {
    return await prisma.dataImport.findMany({
      orderBy: { importedAt: 'desc' },
      take: 10
    });
  }
}

export default new DataImporter();
