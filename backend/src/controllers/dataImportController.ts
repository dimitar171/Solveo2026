import { Request, Response } from 'express';
import dataImporter from '../services/dataImporter';

export class DataImportController {
  /**
   * Upload and import Excel file
   * POST /api/data/import
   */
  async uploadAndImport(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
        return;
      }

      console.log(`📤 Received file: ${req.file.originalname}`);
      
      const result = await dataImporter.importExcelFile(req.file.path);
      
      res.json({ 
        message: 'Data imported successfully',
        ...result 
      });
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        success: false, 
        error: errorMessage 
      });
    }
  }

  /**
   * Get import history
   * GET /api/data/import-history
   */
  async getImportHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await dataImporter.getImportHistory();
      res.json({ success: true, history });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        success: false, 
        error: errorMessage 
      });
    }
  }
}

export default new DataImportController();
