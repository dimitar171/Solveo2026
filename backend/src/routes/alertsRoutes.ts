import { Router } from 'express';
import alertsController from '../controllers/alertsController';

const router = Router();

// Routes
router.get('/', (req, res) => alertsController.getAlerts(req, res));
router.get('/q3-dip', (req, res) => alertsController.getQ3Dip(req, res));

export default router;
