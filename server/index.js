import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const app = createApp();

// Fail fast on a bad connection string instead of surfacing it per-request.
connectDatabase()
  .then(() => console.info('[api] Connected to MongoDB'))
  .catch((error) => console.error('[api] MongoDB connection failed:', error.message));

app.listen(env.port, () => {
  console.info(`[api] Listening on http://localhost:${env.port}`);
  console.info(`[api] Health   http://localhost:${env.port}/api/health`);
  console.info(`[api] REST     http://localhost:${env.port}/api/v1`);
});

export default app;
