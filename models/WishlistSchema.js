const mongoose = require('mongoose');

const WishList=new mongoose.Schema({
  userID:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  items :[
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true }, 
      image: { type: String, required: true },
      details: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    }
  ]
});
const WishListModel = mongoose.model("WishList", WishList);
module.exports = WishListModel;