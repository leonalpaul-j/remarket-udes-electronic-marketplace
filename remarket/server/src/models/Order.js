import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
