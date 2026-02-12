const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  description: { type: String },
  shortDescription: { type: String },
  material: { type: String },
  antiTarnish: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  images: [{ type: String }],
  features: [{ type: String }],
  availableSizes: [{ type: String }],
  sizeGuideImage: { type: String },
  specifications: { type: String },
  supplierInfo: { type: String },
  careInstructions: { type: String },
  categories: [{ type: String }],
  limitedEdition: [{ type: String }],
  giftingOccasions: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  addedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
