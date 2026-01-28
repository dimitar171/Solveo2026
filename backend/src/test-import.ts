// Test script to import the Excel data
import dataImporter from './services/dataImporter';
import path from 'path';

async function testImport() {
  try {
    console.log('🧪 Testing data import...\n');
    
    const filePath = path.join(__dirname, '../uploads', 'ai_coding_agent_dashboard_data.xlsx');
    console.log(`File path: ${filePath}\n`);
    
    const result = await dataImporter.importExcelFile(filePath);
    
    console.log('\n✅ Import test successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import test failed:', error);
    process.exit(1);
  }
}

testImport();
