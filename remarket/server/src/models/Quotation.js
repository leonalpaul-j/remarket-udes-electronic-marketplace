import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  requirement: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredQuantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  shippingCost: { type: Number, default: 0, min: 0 },
  warranty: { type: String, default: '' },
  deliveryDays: { type: Number, default: 0, min: 0 },
  message: { type: String, default: '', maxlength: 2000 },
  status: { type: String, enum: ['submitted', 'accepted', 'rejected', 'withdrawn'], default: 'submitted' }
}, { timestamps: true });

quotationSchema.index({ requirement: 1, supplier: 1 }, { unique: true });
export default mongoose.model('Quotation', quotationSchema);
