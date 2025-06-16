const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  address: String,
  paymentMethod: String,
  totalAmount: Number,

  vendors: [
    {
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
      items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          name: String,
          quantity: Number,
          price: Number,
        }
      ],
      status: { type: String, default: "Pending" }, // For this vendor's portion
      completedAt: { type: Date },
    }
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);


