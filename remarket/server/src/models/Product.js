import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, required: true },
  lifecycle: { type: String, enum: ['first-hand', 'second-hand', 'third-hand', 'scrap'], required: true },
  condition: { type: String, default: 'Good' },
  description: { type: String, required: true, maxlength: 5000 },
  price: { type: Number, min: 0, required: true },
  currency: { type: String, default: 'INR' },
  quantity: { type: Number, min: 1, required: true },
  minOrderQuantity: { type: Number, min: 1, default: 1 },
  location: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  warranty: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', category: 'text' });
export default mongoose.model('Product', productSchema);
