// /server/routes/index.js

import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';

// Import and use API routes
// import loginHandler from '@/api/auth/login.js';
// import signupHandler from '@/api/auth/signup.js';
// import meHandler from '@/api/auth/me.js';
// import logoutHandler from '@/api/auth/logout.js';

// process.cwd() har doim proyekt root'ini qaytaradi
const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));

const router = express.Router();

// router.post('/auth/login', loginHandler);
// router.post('/auth/signup', signupHandler);
// router.post('/auth/me', meHandler);
// router.post('/auth/logout', logoutHandler);

router.get('/', (req, res) => {
  res.json({
    version: packageJson.version,
    apiVersion: `v${packageJson.version.split('.')[0]}`,
    endpoints: {
      auth: `/api/v${packageJson.version.split('.')[0]}/auth`,
      tutors: `/api/v${packageJson.version.split('.')[0]}/tutors`,
      interviews: `/api/v${packageJson.version.split('.')[0]}/interviews`,
      users: `/api/v${packageJson.version.split('.')[0]}/users`,
    },
  });
});

export default router;
