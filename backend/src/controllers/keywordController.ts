import { Request, Response } from 'express';
import keywordService from '../services/keywordService';

export class KeywordController {
  /**
   * Get keywords with optional filters
   * GET /api/keywords?category=High Intent Product&minTraffic=2000
   */
  async getKeywords(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        minTraffic: req.query.minTraffic ? parseInt(req.query.minTraffic as string) : undefined,
        maxConversion: req.query.maxConversion ? parseFloat(req.query.maxConversion as string) : undefined,
        aiOverview: req.query.aiOverview === 'true' ? true : req.query.aiOverview === 'false' ? false : undefined
      };

      const data = await keywordService.getKeywords(filters);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get keyword categories
   * GET /api/keywords/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const data = await keywordService.getCategories();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get problem keywords
   * GET /api/keywords/problems
   */
  async getProblemKeywords(req: Request, res: Response): Promise<void> {
    try {
      const data = await keywordService.getProblemKeywords();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get AI Overview impact
   * GET /api/keywords/ai-overview-impact
   */
  async getAIOverviewImpact(req: Request, res: Response): Promise<void> {
    try {
      const data = await keywordService.getAIOverviewImpact();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get keyword statistics
   * GET /api/keywords/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await keywordService.getKeywordStats();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new KeywordController();
