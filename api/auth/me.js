// api/auth/me.js

import { User } from '@/server/models/index.js';
import { connectToDB } from '@/server/config/index.js';
import { authenticateToken } from '@/server/middleware/auth.js';

async function meHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();

    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export default authenticateToken(meHandler);
