import { Router } from 'express';
import Requirement from '../models/Requirement.js';
import Quotation from '../models/Quotation.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.user.role === 'buyer') filter.buyer = req.user._id;
  else filter.status = 'open';
  if (req.query.q) filter.title = { $regex: req.query.q, $options: 'i' };
  res.json(await Requirement.find(filter).populate('buyer', 'name company email phone whatsapp').sort({ createdAt: -1 }));
});
router.post('/', protect, allow('buyer'), async (req, res) => {
  try {
    const { title, category, description, quantity, deliveryLocation } = req.body;
    if (!title || !category || !description || !deliveryLocation || Number(quantity) < 1)
      return res.status(400).json({ message: 'Title, category, description, quantity and delivery location are required.' });
    const item = await Requirement.create({ ...req.body, buyer: req.user._id });
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.get('/:id/quotations', protect, async (req, res) => {
  const requirement = await Requirement.findById(req.params.id);
  if (!requirement) return res.status(404).json({ message: 'Requirement not found.' });
  if (req.user.role !== 'admin' && String(requirement.buyer) !== String(req.user._id))
    return res.status(403).json({ message: 'Only the buyer can view received quotations.' });
  res.json(await Quotation.find({ requirement: requirement._id }).populate('supplier', 'name company email phone whatsapp').sort({ createdAt: -1 }));
});
router.post('/:id/quotations', protect, allow('supplier', 'recycler'), async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement || requirement.status !== 'open') return res.status(404).json({ message: 'Open requirement not found.' });
    if (String(requirement.buyer) === String(req.user._id)) return res.status(400).json({ message: 'You cannot quote your own requirement.' });
    const offeredQuantity = Number(req.body.offeredQuantity);
    const unitPrice = Number(req.body.unitPrice);
    if (!(offeredQuantity > 0) || !(unitPrice >= 0)) return res.status(400).json({ message: 'Enter a valid quantity and price.' });
    if (!requirement.partialFulfilment && offeredQuantity < requirement.quantity)
      return res.status(400).json({ message: 'This buyer requires the full quantity; partial offers are disabled.' });
    const quotation = await Quotation.create({ ...req.body, requirement: requirement._id, supplier: req.user._id, offeredQuantity, unitPrice });
    res.status(201).json(quotation);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400).json({ message: e.code === 11000 ? 'You already submitted a quotation.' : e.message });
  }
});
router.patch('/quotations/:quotationId/status', protect, allow('buyer'), async (req, res) => {
  const quote = await Quotation.findById(req.params.quotationId).populate('requirement');
  if (!quote) return res.status(404).json({ message: 'Quotation not found.' });
  if (String(quote.requirement.buyer) !== String(req.user._id)) return res.status(403).json({ message: 'Not your requirement.' });
  if (!['accepted', 'rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status.' });
  quote.status = req.body.status;
  await quote.save();
  if (req.body.status === 'accepted') {
    quote.requirement.status = 'fulfilled';
    await quote.requirement.save();
  }
  res.json(quote);
});
export default router;
