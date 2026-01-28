import { Router, Request, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'This is a test endpoint',
    data: {
      users: 100,
      revenue: 50000
    }
  });
});

export default router;
