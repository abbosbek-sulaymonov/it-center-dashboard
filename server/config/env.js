import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// `.env.local` holds developer secrets and is git-ignored; `.env` is the shared
// fallback. On Vercel neither file exists and the values come from the dashboard.
dotenv.config({ path: path.join(rootDir, '.env.local'), quiet: true });
dotenv.config({ path: path.join(rootDir, '.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

function optional(name, fallback) {
  return process.env[name] || fallback;
}

/**
 * JWT_SECRET is mandatory in production. In development we fall back to a
 * well-known value so a fresh clone runs without setup, and warn loudly.
 */
function resolveJwtSecret() {
  if (isProduction) return required('JWT_SECRET');

  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  console.warn('[env] JWT_SECRET is not set — using an insecure development default.');
  return 'insecure-development-secret-do-not-use-in-production';
}

export const env = {
  nodeEnv,
  isProduction,
  isTest: nodeEnv === 'test',
  port: Number(optional('PORT', '5001')),
  rootDir,
  mongodbUri: optional('MONGODB_URI', ''),
  jwtSecret: resolveJwtSecret(),
  clientOrigins: optional('CLIENT_ORIGIN', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

/** Throws when something the API cannot start without is missing. */
export function assertRuntimeEnv() {
  if (!env.mongodbUri) {
    throw new Error(
      'Missing required environment variable MONGODB_URI. Copy .env.example to .env.local and fill it in.',
    );
  }
}
