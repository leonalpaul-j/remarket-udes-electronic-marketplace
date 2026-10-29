import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company, phone, whatsapp } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    if (role === 'admin') return res.status(400).json({ message: 'Admin accounts are created securely by the administrator.' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 12),
      role: ['buyer', 'supplier', 'recycler'].includes(role) ? role : 'buyer',
      company, phone, whatsapp
    });
    res.status(201).json({ token: makeToken(user), user });
  } catch (e) { res.status(500).json({ message: e.message || 'Registration failed.' }); }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  if (!user.isActive) return res.status(403).json({ message: 'This account has been deactivated.' });
  res.json({ token: makeToken(user), user });
});

router.get('/me', protect, (req, res) => res.json({ user: req.user }));
export default router;
