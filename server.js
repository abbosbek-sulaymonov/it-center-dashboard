import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import { errorHandler } from './server/middleware/errorHandler.js';
import routes from './server/routes/index.js';
// import authRoutes from './server/routes/auth.js';
import { connectDB } from './server/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env.local');
dotenv.config({ path: envPath });

const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

process.env.APP_VERSION = packageJson.version;
process.env.API_VERSION = `v${packageJson.version.split('.')[0]}`;

const app = express();
const distPath = path.join(__dirname, 'dist');

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? ['https://mockint.vercel.app'] : ['http://localhost:3000'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API version
const apiVersion = `v${packageJson.version.split('.')[0]}`;

// Health check - NON-versioned (accessible at /api/health)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Server is running',
    version: packageJson.version,
    apiVersion: apiVersion,
    timestamp: new Date().toISOString(),
  });
});

// API Routes - versioned
app.use(`/api/${apiVersion}`, routes);
// app.use(`/api/${apiVersion}/auth`, authRoutes);

// Serve static files only in production
// if (process.env.NODE_ENV === 'production') {
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
    });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});
// }

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path,
    availableEndpoints: {
      health: '/api/health',
      auth: `/api/${apiVersion}/auth`,
      main: `/api/${apiVersion}`,
    },
  });
});

// Error handling
app.use(errorHandler);

export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📚 API ${apiVersion}: http://localhost:${PORT}/api/${apiVersion}`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/${apiVersion}/auth`);
  });
}
