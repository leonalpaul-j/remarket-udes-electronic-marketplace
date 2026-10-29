import { Router } from 'express';
import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.get('/', async (_req, res) => {
  const now = new Date();
  await Auction.updateMany({ status: 'active', endsAt: { $lte: now } }, { status: 'ended' });
  res.json(await Auction.find().populate('seller', 'name company').populate('highestBidder', 'name company').sort({ endsAt: 1 }));
});
router.post('/', protect, allow('supplier', 'recycler', 'admin'), async (req, res) => {
  try {
    const a = new Auction({ ...req.body, seller: req.user._id });
    if (new Date(a.endsAt) <= new Date(a.startsAt)) return res.status(400).json({ message: 'Auction end must be after start.' });
    await a.save();
    res.status(201).json(a);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.get('/:id/bids', protect, async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) return res.status(404).json({ message: 'Auction not found.' });
  res.json(await Bid.find({ auction: auction._id }).populate('bidder', 'name company').sort({ amount: -1 }));
});
router.post('/:id/bids', protect, allow('buyer'), async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) return res.status(404).json({ message: 'Auction not found.' });
  const now = new Date();
  if (String(auction.seller) === String(req.user._id)) return res.status(400).json({ message: 'You cannot bid on your own auction.' });
  if (auction.status !== 'active' || now < auction.startsAt || now >= auction.endsAt) return res.status(400).json({ message: 'Auction is not open for bidding.' });
  const minimum = auction.highestBid == null ? auction.startingBid : auction.highestBid + auction.minIncrement;
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount < minimum) return res.status(400).json({ message: `Bid must be at least ${minimum}.` });
  // Basic validation; use MongoDB transactions/atomic updates for high-concurrency production bidding.
  await Bid.create({ auction: auction._id, bidder: req.user._id, amount });
  auction.highestBid = amount;
  auction.highestBidder = req.user._id;
  await auction.save();
  res.status(201).json({ message: 'Bid placed.', auction });
});
export default router;
