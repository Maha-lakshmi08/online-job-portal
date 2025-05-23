import express from 'express';
import { getUserData, updateUserResume } from '../controllers/userController.js';
import { requireAuth } from '@clerk/express';
import User from '../models/User.js';

const router = express.Router();

// GET authenticated user data
router.get('/me', requireAuth(), getUserData);

// PUT update resume
router.put('/resume', requireAuth(), updateUserResume);

// POST: create user on first login
router.post('/', requireAuth(), async (req, res) => {
  try {
    const { name, email, clerkId } = req.body;

    const existing = await User.findOne({ clerkId });
    if (existing) {
      return res.json({ success: true, user: existing });
    }

    const user = new User({ name, email, clerkId });
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

export default router;
