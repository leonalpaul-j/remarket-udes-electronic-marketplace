import { Router } from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/', protect, async (req, res) => {
  const items = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(items);
});
router.patch('/:id/read', protect, async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: 'Notification not found.' });
  res.json(item);
});
export default router;
