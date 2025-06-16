const mongoose = require('mongoose');

const CartSchema=new mongoose.Schema({
  userID:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  items :[
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true }, 
      image: { type: String, required: true },
      details: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      discount: { type: Number, default: 0 },
    }
  ]
});
const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;