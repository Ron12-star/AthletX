const CartModel = require("../models/CartSchema.js");
const ProductModel = require("../models/productschema.js");

//add to cart
const addToCart = async (req, res) => {
  const mongoose = require("mongoose");

  try {
    // console.log("Session User:", req.session.user);
    const userID = req.session.user._id;
    const { productId } = req.body;
    //check product id
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    //print user and product id
    // console.log("✅ User ID:", userID, "✅ Product ID:", productId);
    //fetch from mongoDB compass
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    console.log(" Product Details:", product);

    //required fiels
    if (!product.name || !product.image || !product.details || !product.price) {
      return res.status(400).json({
        success: false,
        message: "Product is missing required fields",
        missingFields: {
          name: product.name,
          image: product.image,
          details: product.details,
          price: product.price,
        },
      });
    }

    //find userCart from mongoDB compass
    let userCart = await CartModel.findOne({ userID: userID });

    if (!userCart) {
      //create new cart
      userCart = new CartModel({
        userID,
        items: [],
        message: "your cart is empty",
      });
    }
    //alredy if item exist in cart
    const productIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      //exist than increase by 1
      userCart.items[productIndex].quantity += 1;
    } else {
      //add item in cart
      userCart.items.push({
        productId: new mongoose.Types.ObjectId(product._id),
        name: product.name,
        image: product.image,
        details: product.details,
        price: product.price,
        quantity: 1,
        sales: 0,
        discount: product.discount,
      });
    }

    await userCart.save();
    res.json({ success: true, message: "Product added to cart!" });
  } catch (error) {
    console.log("Error in adding item to cart", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const getCart = async (req, res) => {
  try {
    const userID = req.session.user._id;

    const userCart = await CartModel.findOne({ userID });

    if (!userCart || userCart.items.length === 0) {
      return res.render("cart", {
        cartItems: [],
        totalPrice:0,
        message: "Your cart is empty.",
      });
    }
    const totalPrice=userCart.items.reduce((sum,item)=>sum+item.price*item.quantity,0);
    res.render("cart", { cartItems: userCart.items,totalPrice, message: null });
  } catch {
    console.log("Error in adding item to cart", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const removeFromCart = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not logged in" });
    }

    const userID = req.session.user._id;
    const productId = req.params.productId;

    console.log(
      "🔍 Received request to remove Product ID:",
      productId,
      "for User ID:",
      userID
    ); // Debugging log

    let userCart = await CartModel.findOne({ userID });

    if (!userCart) {
      console.log("❌ No cart found for user!");
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const initialLength = userCart.items.length;
    userCart.items = userCart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    const finalLength = userCart.items.length;

    if (initialLength === finalLength) {
      console.log("❌ Item not found in cart!");
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    await userCart.save();
    console.log("✅ Item removed successfully from cart!");

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      if (!req.session || !req.session.user) {
          return res.status(401).json({ success: false, message: "User not logged in" });
      }

      const userID = req.session.user._id;
      let userCart = await CartModel.findOne({ userID });

      if (!userCart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
      }

      const productIndex = userCart.items.findIndex((item) => item.productId.toString() === productId);

      if (productIndex === -1) {
          return res.status(404).json({ success: false, message: "Product not found in cart" });
      }

      // Ensure quantity is at least 1
      userCart.items[productIndex].quantity = Math.max(1, quantity);
      await userCart.save();

      const totalPrice = userCart.items.reduce((sum, item) => sum + item.price * item.quantity * (1 - item.discount / 100), 0);

      res.json({ success: true, message: "Cart updated successfully!", totalPrice });
  } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = { addToCart, getCart, removeFromCart,updateCart };
