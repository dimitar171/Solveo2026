import { Router } from 'express';
import regionalController from '../controllers/regionalController';

const router = Router();

// Routes
router.get('/', (req, res) => regionalController.getRegionalData(req, res));
router.get('/breakdown', (req, res) => regionalController.getBreakdown(req, res));
router.get('/countries', (req, res) => regionalController.getCountryBreakdown(req, res));
router.get('/cities', (req, res) => regionalController.getCityBreakdown(req, res));
router.get('/underperforming', (req, res) => regionalController.getUnderperforming(req, res));
router.get('/list', (req, res) => regionalController.getRegions(req, res));
router.get('/countries-list', (req, res) => regionalController.getCountries(req, res));
router.get('/cities-list', (req, res) => regionalController.getCities(req, res));

export default router;
