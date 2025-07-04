const Order=require("../models/OrderSchema");
const Product=require("../models/productschema");
const User=require("../models/UserSchema");
const Cart = require('../models/CartSchema');
const checkoutPage = async (req, res) => {
  try {
    const cart = req.session.cart || [];

    // 1. Get full product details
    const cartItems = await Promise.all(
      cart.map(async item => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product?.name || "Product",
        };
      })
    );

    // 2. Fetch user details using session ID
    const userId = req.session.user?._id;
    const user = await User.findById(userId).lean();

    if (!user) return res.redirect("/login");

    // 3. Send both cartItems and user data to EJS
    res.render("checkout", {
      cartItems,
      user
    });

  } catch (error) {
    console.error("Error rendering checkout:", error);
    res.status(500).send("Something went wrong");
  }
};


// ✅ user controller
const placeorder = async (req, res) => {
  try {
    const { name, phone, address, paymentMethod } = req.body;
    const userId = req.session.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userCart = await Cart.findOne({ userID: userId });
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🧾 Group items by vendor
    const vendorMap = {}; // { vendorId: [items...] }
    let totalAmount = 0;

    for (const item of userCart.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const itemData = {
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      };

      totalAmount += item.quantity * product.price;

      const vendorId = product.vendorId.toString();
      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = [];
      }
      vendorMap[vendorId].push(itemData);
    }

    // 📦 Build vendors array
    const vendors = Object.entries(vendorMap).map(([vendorId, items]) => ({
      vendorId,
      items,
      status: "Pending"
    }));

    // 💾 Create one single multi-vendor order
    const newOrder = new Order({
      userId,
      name,
      phone,
      address,
      paymentMethod,
      totalAmount,
      vendors
    });

    await newOrder.save();

    // ✅ Clear cart
    await Cart.deleteOne({ userID: userId });

    // 🟢 Show a pending message to user
    // res.redirect("latest-order");

    req.session.latestOrderId = newOrder._id;
res.redirect("/order-status");

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).send("Error placing order");
  }
};

const getOrderStatus = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;

    // 🆕 Find the most recent order by this user
    const order = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!order) {
      return res.redirect("/");
    }

    // Check if all vendors have completed
    const allVendorsCompleted = order.vendors.every(v => v.status === "Completed");

    if (allVendorsCompleted) {
      return res.render("userorder-confirmation", { order });
    } else {
      return res.render("userorder-panding", { order });
    }
  } catch (error) {
    console.error("❌ Error in getOrderStatus:", error);
    res.status(500).send("Error checking order status");
  }
};



const getOrderConfirmation=(req,res)=>{
  res.render('userorder-confirmation');
}
// const getUserOrdersWithStatus = async (req, res) => {
//   try {
//     if (!req.session.user || !req.session.user._id) {
//       return res.redirect("/login");
//     }

//     const userId = req.session.user._id;

//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })
//       .lean();

//       const detailedOrders = orders.map(order => ({
//         _id: order._id,
//         createdAt: order.createdAt,
//         completedVendors: order.vendors
//           .filter(vendor => vendor.status === "Completed")
//           .map(vendor => ({
//             status: "Completed",
//             completedAt: vendor.completedAt,
//             items: vendor.items.map(item => ({
//               name: item.name,
//               description: item.description,
//               image: item.image, // Should be a URL or relative path
//               price: item.price,
//               quantity: item.quantity,
//               total: item.price * item.quantity
//             }))
//           }))
//       }));

//     res.render("userorder-confirmation", { orders: detailedOrders });
//   } catch (error) {
//     console.error("❌ Error fetching user orders:", error);
//     res.status(500).send("Error fetching orders");
//   }
// };

const getUserOrdersWithStatus = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Latest first
      .lean();

    if (orders.length === 0) {
      return res.render("userorder-panding", { message: "No orders placed yet.",order:{} });
    }

    const latestOrder = orders[0];

    const allVendorsCompleted = latestOrder.vendors.every(vendor => vendor.status === "Completed");

    if (!allVendorsCompleted) {
      return res.render("userorder-panding", { order: latestOrder });
    }

    // Prepare confirmation details if completed
    const completedVendors = latestOrder.vendors
      .filter(vendor => vendor.status === "Completed")
      .map(vendor => ({
        status: "Completed",
        completedAt: vendor.completedAt,
        items: vendor.items.map(item => ({
          name: item.name,
          description: item.description,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        }))
      }));

    const confirmedOrder = {
      _id: latestOrder._id,
      createdAt: latestOrder.createdAt,
      completedVendors
    };

    res.render("userorder-confirmation", { orders: [confirmedOrder] });

  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).send("Error fetching orders");
  }
};






module.exports={checkoutPage,placeorder,getOrderConfirmation,getUserOrdersWithStatus ,getOrderStatus};
