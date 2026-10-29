import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();

router.post('/', protect, allow('buyer'), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ message: 'Invalid product.' });
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount < 1) return res.status(400).json({ message: 'Quantity must be a positive whole number.' });
    const product = await Product.findOne({ _id: productId, status: 'approved' }).populate('seller', 'name company');
    if (!product) return res.status(404).json({ message: 'This product is unavailable or not approved.' });
    if (String(product.seller._id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot order your own product.' });
    if (amount < (product.minOrderQuantity || 1)) return res.status(400).json({ message: `Minimum order quantity is ${product.minOrderQuantity || 1}.` });
    if (amount > product.quantity) return res.status(400).json({ message: `Only ${product.quantity} units are currently available.` });
    const order = await Order.create({ product: product._id, buyer: req.user._id, supplier: product.seller._id, quantity: amount, unitPrice: product.price, totalPrice: product.price * amount, currency: product.currency || 'INR' });
    await Notification.create({ recipient: product.seller._id, order: order._id, title: 'New order received', message: `Order placed by ${req.user.name} for ${product.title} (quantity: ${amount}).` });
    res.status(201).json({ message: 'Order placed successfully. The supplier has been notified in their dashboard.', order });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Could not place the order.' }); }
});

router.get('/mine', protect, async (req, res) => {
  const filter = req.user.role === 'buyer' ? { buyer: req.user._id } : ['supplier','recycler','admin'].includes(req.user.role) ? (req.user.role === 'admin' ? {} : { supplier: req.user._id }) : { buyer: req.user._id };
  const orders = await Order.find(filter).populate('product', 'title imageUrl lifecycle').populate('buyer', 'name email company').populate('supplier', 'name email company').sort({ createdAt: -1 });
  res.json(orders);
});

router.patch('/:id/status', protect, allow('supplier','recycler','admin'), async (req, res) => {
  const { status } = req.body;
  if (!['accepted','rejected','completed'].includes(status)) return res.status(400).json({ message: 'Invalid order status.' });
  const order = await Order.findById(req.params.id).populate('product', 'title');
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  if (req.user.role !== 'admin' && String(order.supplier) !== String(req.user._id)) return res.status(403).json({ message: 'You can only update orders for your own products.' });
  if (order.status === 'rejected' || order.status === 'completed') return res.status(400).json({ message: 'This order can no longer be changed.' });
  order.status = status; await order.save();
  await Notification.create({ recipient: order.buyer, order: order._id, title: `Order ${status}`, message: `Your order for ${order.product?.title || 'a product'} was ${status} by the supplier.` });
  res.json({ message: `Order ${status}.`, order });
});
export default router;
