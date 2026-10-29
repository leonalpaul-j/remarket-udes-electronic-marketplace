import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Requirement from '../models/Requirement.js';
import Auction from '../models/Auction.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.use(protect, allow('admin'));
router.get('/stats', async (_req, res) => {
  const [users, products, pendingProducts, requirements, auctions] = await Promise.all([
    User.countDocuments(), Product.countDocuments(), Product.countDocuments({ status: 'pending' }),
    Requirement.countDocuments(), Auction.countDocuments()
  ]);
  res.json({ users, products, pendingProducts, requirements, auctions });
});
router.get('/users', async (_req, res) => res.json(await User.find().select('-password').sort({ createdAt: -1 })));
router.patch('/users/:id', async (req, res) => {
  if (req.params.id === String(req.user._id)) return res.status(400).json({ message: 'You cannot deactivate your own admin account.' });
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});
router.get('/pending-products', async (_req, res) => res.json(await Product.find({ status: 'pending' }).populate('seller', 'name company email')));
router.get('/requirements', async (_req, res) => res.json(await Requirement.find().populate('buyer', 'name email').sort({ createdAt: -1 })));
export default router;
