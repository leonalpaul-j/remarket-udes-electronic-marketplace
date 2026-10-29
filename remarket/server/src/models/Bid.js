import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, min: 0, required: true }
}, { timestamps: true });

export default mongoose.model('Bid', bidSchema);
