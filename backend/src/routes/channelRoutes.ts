import { Router } from 'express';
import channelController from '../controllers/channelController';

const router = Router();

// Routes
router.get('/', (req, res) => channelController.getChannelData(req, res));
router.get('/comparison', (req, res) => channelController.getComparison(req, res));
router.get('/low-performing', (req, res) => channelController.getLowPerforming(req, res));
router.get('/list', (req, res) => channelController.getChannels(req, res));
router.get('/trends', (req, res) => channelController.getTrends(req, res));

export default router;
