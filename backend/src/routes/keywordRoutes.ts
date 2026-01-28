import { Router } from 'express';
import keywordController from '../controllers/keywordController';

const router = Router();

// Routes
router.get('/', (req, res) => keywordController.getKeywords(req, res));
router.get('/categories', (req, res) => keywordController.getCategories(req, res));
router.get('/problems', (req, res) => keywordController.getProblemKeywords(req, res));
router.get('/ai-overview-impact', (req, res) => keywordController.getAIOverviewImpact(req, res));
router.get('/stats', (req, res) => keywordController.getStats(req, res));

export default router;
