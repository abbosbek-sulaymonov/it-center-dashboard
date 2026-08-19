import mongoose from 'mongoose';

import { env, assertRuntimeEnv } from './env.js';

/**
 * Serverless platforms re-run module code per cold start but keep the process
 * alive between invocations, so the connection is cached on `globalThis`.
 */
const globalCache = globalThis.__itCenterMongoose ?? { conn: null, promise: null };
globalThis.__itCenterMongoose = globalCache;

export async function connectDatabase() {
  if (globalCache.conn) return globalCache.conn;

  assertRuntimeEnv();

  if (!globalCache.promise) {
    mongoose.set('strictQuery', true);

    globalCache.promise = mongoose.connect(env.mongodbUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    globalCache.promise = null;
    throw error;
  }

  return globalCache.conn;
}

export async function disconnectDatabase() {
  if (!globalCache.conn) return;
  await mongoose.disconnect();
  globalCache.conn = null;
  globalCache.promise = null;
}
