const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Ensure image URL is provided
  name: { type: String, required: true, trim: true },
  details: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  sales: { type: Number, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 }, // Discount in percentage
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Men", "Women", "Kids", "Shoes", "Equipment & Cycles", "Bags & Backpacks", "Sports Accessories"] 
  }, // Category selection
  subcategory: { type: String },
  bestseller: { type: Boolean, default: false },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model('Product', productSchema);


