import path from 'node:path';
import { existsSync } from 'node:fs';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

const API_PREFIX = '/api/v1';

export function createApp() {
  const app = express();

  // Behind Vercel/any proxy, so client IPs (used by the rate limiter) resolve.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      // The SPA and API share an origin; the default CSP blocks Vite's assets.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors({ origin: env.clientOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (!env.isTest) app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  // Unversioned, and deliberately free of a database round-trip.
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
  });

  // Connect lazily so the process still boots (and /api/health still answers)
  // when Mongo is unreachable.
  app.use(API_PREFIX, async (_req, _res, next) => {
    try {
      await connectDatabase();
      next();
    } catch (error) {
      next(error);
    }
  });
  app.use(API_PREFIX, routes);

  app.use('/api', notFoundHandler);

  serveClientBuild(app);

  app.use(errorHandler);

  return app;
}

/**
 * In production the same process serves the built SPA. In development Vite owns
 * the frontend and proxies `/api` here, so there is nothing to serve.
 */
function serveClientBuild(app) {
  const distPath = path.join(env.rootDir, 'dist');
  if (!existsSync(distPath)) return;

  app.use(express.static(distPath));

  // Client-side routing fallback. Express 5 rejects a bare '*' path, so this is
  // a terminal middleware rather than a wildcard route.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}
