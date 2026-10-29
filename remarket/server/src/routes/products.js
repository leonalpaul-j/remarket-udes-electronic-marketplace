import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, allow } from '../middleware/auth.js';
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Please upload a JPG, PNG, WEBP, or GIF image.'));
  }
});
router.get('/', async (req, res) => {
  const filter = { status: 'approved' };
  if (req.query.lifecycle) filter.lifecycle = req.query.lifecycle;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) filter.$text = { $search: req.query.q };
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 12;
  const [items, total] = await Promise.all([
    Product.find(filter).populate('seller', 'name company phone whatsapp email').sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});
router.get('/mine', protect, async (req, res) => {
  res.json(await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }));
});
router.post('/', protect, allow('supplier', 'recycler', 'admin'), upload.single('image'), async (req, res) => {
  try {
    const { title, category, lifecycle, description, price, quantity } = req.body;
    if (!title || !category || !description || price === undefined || quantity === undefined)
      return res.status(400).json({ message: 'Please fill all required product fields.' });
    const item = await Product.create({ ...req.body, imageUrl: req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || ''), seller: req.user._id, status: 'pending' });
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.patch('/:id/moderate', protect, allow('admin'), async (req, res) => {
  const status = req.body.status;
  if (!['approved', 'rejected', 'suspended'].includes(status)) return res.status(400).json({ message: 'Invalid moderation status.' });
  const item = await Product.findByIdAndUpdate(req.params.id, { status, rejectionReason: req.body.reason || '' }, { new: true });
  if (!item) return res.status(404).json({ message: 'Product not found.' });
  res.json(item);
});
router.delete('/:id', protect, async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Product not found.' });
  if (req.user.role !== 'admin' && String(item.seller) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing.' });
  await item.deleteOne();
  res.json({ message: 'Product deleted.' });
});
export default router;
