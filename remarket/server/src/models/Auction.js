import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, min: 1, required: true },
  startingBid: { type: Number, min: 0, required: true },
  reservePrice: { type: Number, min: 0, default: null },
  minIncrement: { type: Number, min: 1, default: 100 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'active', 'ended', 'cancelled'], default: 'active' },
  highestBid: { type: Number, default: null },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);
