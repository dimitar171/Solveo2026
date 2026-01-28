import { Router } from 'express';
import healthRoutes from './healthRoutes';
import dataImportRoutes from './dataImportRoutes';
import schedulerRoutes from './schedulerRoutes';
import metricsRoutes from './metricsRoutes';
import keywordRoutes from './keywordRoutes';
import regionalRoutes from './regionalRoutes';
import channelRoutes from './channelRoutes';
import alertsRoutes from './alertsRoutes';

const router = Router();

// Mount routes
router.use('/', healthRoutes);
router.use('/data', dataImportRoutes);
router.use('/scheduler', schedulerRoutes);
router.use('/metrics', metricsRoutes);
router.use('/keywords', keywordRoutes);
router.use('/regions', regionalRoutes);
router.use('/channels', channelRoutes);
router.use('/alerts', alertsRoutes);

export default router;
