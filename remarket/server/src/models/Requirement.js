import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 160 },
  category: { type: String, required: true },
  description: { type: String, required: true, maxlength: 5000 },
  quantity: { type: Number, required: true, min: 1 },
  condition: { type: String, default: 'Any' },
  targetPrice: { type: Number, min: 0, default: null },
  currency: { type: String, default: 'INR' },
  deliveryLocation: { type: String, required: true },
  deadline: { type: Date, default: null },
  partialFulfilment: { type: Boolean, default: false },
  status: { type: String, enum: ['open', 'partially-fulfilled', 'fulfilled', 'closed', 'expired'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Requirement', requirementSchema);
