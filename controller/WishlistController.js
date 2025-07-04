const mongoose = require("mongoose");
const WishListModel = require("../models/WishlistSchema");
const Product = require("../models/productschema");
const CartModel=require("../models/CartSchema");
const addToWishList = async (req, res) => {
  try {
    const userID = req.session.user._id;
    let { productId } = req.body;

    if (!productId) {
      return res.send(`
        <script>
          alert("ProductId is required.");
          window.location.href = document.referrer;
        </script>
      `);
    }

    try {
      productId = new mongoose.Types.ObjectId(productId);
    } catch (error) {
      return res.send(`
        <script>
          alert("Invalid ProductId.");
          window.location.href = document.referrer;
        </script>
      `);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.send(`
        <script>
          alert("Product not found.");
          window.location.href = document.referrer;
        </script>
      `);
    }

    let wishList = await WishListModel.findOne({ userID });
    if (!wishList) {
      wishList = new WishListModel({ userID, items: [] });
    }

    const alreadyInWishlist = wishList.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (alreadyInWishlist) {
      return res.send(`
        <script>
          alert("Product already in wishlist!");
          window.location.href = document.referrer;
        </script>
      `);
    }

    wishList.items.push({
      productId: product._id,
      name: product.name,
      image: product.image,
      details: product.details,
      price: product.price,
      discount: product.discount,
    });

    await wishList.save();

    return res.send(`
      <script>
        alert("Product added to wishlist!");
        window.location.href = document.referrer;
      </script>
    `);

  } catch (error) {
    console.error("Error adding item to wishlist", error);
    return res.send(`
      <script>
        alert("Something went wrong. Try again later.");
        window.location.href = document.referrer;
      </script>
    `);
  }
};

const getWishlist = async (req, res) => {
  try {
    const userID = req.session.user._id;
    const wishList = await WishListModel.findOne({ userID });

    if (!wishList || wishList.items.length === 0) {
      return res.render("wishlist", { wishlistItems: [], message: "Your wishlist is empty." });
    }

    res.render("wishlist", { wishlistItems: wishList.items, message: null });
  } catch (error) {
    console.error("Error fetching wishlist", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userID = req.session.user._id;
    let { productId } = req.params; // Directly extract productId from params

    // Validate productId
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid ProductId" });
    }
    productId = new mongoose.Types.ObjectId(productId);

    let wishList = await WishListModel.findOne({ userID });

    if (!wishList) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }
    console.log("Wishlist items before removal:", wishList.items.map(item => item.productId.toString()));
    console.log("ProductId to remove:", productId.toString());
    const initialLength = wishList.items.length;

    // Remove the product from wishlist
    wishList.items = wishList.items.filter(
      (item) => item.productId.equals(productId) === false // ✅ Correct way to compare ObjectId
    );
    console.log("Wishlist items after removal:", wishList.items.map(item => item.productId.toString()));
    // If no item was removed, product was not found in wishlist
    if (wishList.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not found in wishlist" });
    }

    await wishList.save();
    res.json({ success: true, message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error removing item from wishlist", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const moveToCart = async (req, res) => {
  try {
    const userID = req.session.user._id;
    let { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId is required" });
    }

    try {
      productId = new mongoose.Types.ObjectId(productId);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid ProductId" });
    }

    let wishList = await WishListModel.findOne({ userID });
    if (!wishList) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const productIndex = wishList.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in wishlist" });
    }

    // Get product details
    const productToMove = wishList.items[productIndex];

    // Remove from wishlist
    wishList.items.splice(productIndex, 1);
    await wishList.save();

    // Add to Cart
    let cart = await CartModel.findOne({ userID });
    if (!cart) {
      cart = new CartModel({ userID, items: [] });
    }

    cart.items.push({
      productId: productToMove.productId,
      name: productToMove.name,
      image: productToMove.image,
      details: productToMove.details,
      price: productToMove.price,
      discount: productToMove.discount,
      quantity: 1, // Default quantity
    });

    await cart.save();

    res.json({ success: true, message: "Product moved to cart" });
  } catch (error) {
    console.error("Error moving item to cart", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = { addToWishList, getWishlist, removeFromWishlist,moveToCart };
