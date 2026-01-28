import { Router } from 'express';
import schedulerController from '../controllers/schedulerController';

const router = Router();

// Routes
router.get('/status', (req, res) => 
  schedulerController.getStatus(req, res)
);

router.post('/start', (req, res) => 
  schedulerController.start(req, res)
);

router.post('/stop', (req, res) => 
  schedulerController.stop(req, res)
);

router.post('/trigger', (req, res) => 
  schedulerController.trigger(req, res)
);

router.post('/config', (req, res) => 
  schedulerController.updateConfig(req, res)
);

export default router;
