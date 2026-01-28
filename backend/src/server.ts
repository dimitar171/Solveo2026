import express from 'express';
import cors from 'cors';
import routes from './routes';
import scheduler from './services/scheduler';

const app = express();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mount all routes under /api
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, HOST, () => {
  const baseUrl = `http://${HOST}:${PORT}`;
  console.log(`🚀 Server running on ${baseUrl}`);
  console.log(`📊 API available at ${baseUrl}/api`);
  console.log(`📥 Upload endpoint: POST ${baseUrl}/api/data/import`);
  console.log(`⏰ Scheduler endpoint: GET ${baseUrl}/api/scheduler/status`);
  
  // Start scheduler if enabled
  scheduler.start();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  scheduler.stop();
  process.exit(0);
});
