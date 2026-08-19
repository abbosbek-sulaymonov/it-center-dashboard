// Vercel serverless entry point. Every /api/* request is rewritten here by
// vercel.json and handed to the same Express app used in development.
import { createApp } from '../server/app.js';

export default createApp();
