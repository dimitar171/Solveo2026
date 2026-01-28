import { Router } from 'express';
import { upload } from '../middleware/upload';
import dataImportController from '../controllers/dataImportController';

const router = Router();

// Routes
router.post('/import', upload.single('file'), (req, res) => 
  dataImportController.uploadAndImport(req, res)
);

router.get('/import-history', (req, res) => 
  dataImportController.getImportHistory(req, res)
);

export default router;
