import { Router } from 'express';
import metricsController from '../controllers/metricsController';

const router = Router();

// Routes
router.get('/summary', (req, res) => metricsController.getSummary(req, res));
router.get('/trends', (req, res) => metricsController.getTrends(req, res));
router.get('/funnel', (req, res) => metricsController.getFunnel(req, res));
router.get('/months', (req, res) => metricsController.getMonths(req, res));

export default router;
