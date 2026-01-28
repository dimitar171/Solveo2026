import { Request, Response } from 'express';
import regionalService from '../services/regionalService';

export class RegionalController {
  /**
   * Get regional data with filters
   * GET /api/regions?region=APAC&country=India
   */
  async getRegionalData(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        region: req.query.region as string | undefined,
        country: req.query.country as string | undefined,
        city: req.query.city as string | undefined,
        month: req.query.month as string | undefined
      };

      const data = await regionalService.getRegionalData(filters);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get regional breakdown (aggregated)
   * GET /api/regions/breakdown
   */
  async getBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const data = await regionalService.getRegionalBreakdown();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get country breakdown for a region
   * GET /api/regions/countries?region=APAC
   */
  async getCountryBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const region = req.query.region as string;
      
      if (!region) {
        res.status(400).json({ success: false, error: 'Region parameter is required' });
        return;
      }

      const data = await regionalService.getCountryBreakdown(region);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get city breakdown for a country
   * GET /api/regions/cities?country=India
   */
  async getCityBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const country = req.query.country as string;
      
      if (!country) {
        res.status(400).json({ success: false, error: 'Country parameter is required' });
        return;
      }

      const data = await regionalService.getCityBreakdown(country);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get underperforming regions
   * GET /api/regions/underperforming
   */
  async getUnderperforming(req: Request, res: Response): Promise<void> {
    try {
      const data = await regionalService.getUnderperformingRegions();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get list of regions
   * GET /api/regions/list
   */
  async getRegions(req: Request, res: Response): Promise<void> {
    try {
      const data = await regionalService.getRegions();
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get list of countries
   * GET /api/regions/countries-list?region=APAC
   */
  async getCountries(req: Request, res: Response): Promise<void> {
    try {
      const region = req.query.region as string | undefined;
      const data = await regionalService.getCountries(region);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }

  /**
   * Get list of cities
   * GET /api/regions/cities-list?country=India
   */
  async getCities(req: Request, res: Response): Promise<void> {
    try {
      const country = req.query.country as string | undefined;
      const data = await regionalService.getCities(country);
      res.json({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
}

export default new RegionalController();
