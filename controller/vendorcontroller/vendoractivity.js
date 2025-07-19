const Product = require("../../models/productschema");
const mongoose = require("mongoose");
const Order = require("../../models/OrderSchema");
const upload = require("../../multer/multer");
const AddItems = async (req, res) => {
  try {
    const image = req.file?.filename;
    const {
      name,
      details,
      quantity,
      price,
      sales,
      discount,
      category,
      subcategory,
    } = req.body;
    console.log("🧾 req.file:", image );
    console.log("📦 req.body:", req.body);

    if (
      !image ||
      !name ||
      !details ||
      quantity == null ||
      price == null ||
      !category
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled!" });
    }

    const validCategories = [
      "Men",
      "Women",
      "Kids",
      "Shoes",
      "Equipment & Cycles",
      "Bags & Backpacks",
      "Sports Accessories",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category selected!" });
    }

    const newProduct = new Product({
      image: "Images/" + image,
      name,
      details,
      quantity: Number(quantity),
      price: Number(price),
      sales: sales || 0,
      discount: discount || 0,
      category,
      subcategory: subcategory || "",
      vendorId: req.session.user._id,
      bestseller: req.body.bestseller === "on",
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

const UpdateItems = async (req, res) => {
  try {
    const {
      image,
      name,
      details,
      quantity,
      price,
      sales,
      discount,
      category,
      subcategory,
      bestseller,
    } = req.body;

    // Validate category if provided
    const validCategories = [
      "Men",
      "Women",
      "Kids",
      "Shoes",
      "Equipment & Cycles",
      "Bags & Backpacks",
      "Sports Accessories",
    ];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category selected!" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.session.user._id },
      {
        ...(image && { image }),
        ...(name && { name }),
        ...(details && { details }),
        ...(quantity !== undefined && { quantity }),
        ...(price !== undefined && { price }),
        ...(sales !== undefined && { sales }),
        ...(discount !== undefined && { discount }),
        ...(category && { category }),
        ...(subcategory && { subcategory }),
        ...(bestseller && { bestseller }),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};
const DeleteItems = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.session.user._id,
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
const getPendingOrders = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "vendor") {
      return res.status(403).send("Unauthorized access");
    }

    const vendorId = req.session.user._id;

    // Find orders that include this vendor with a pending status
    const orders = await Order.find({ "vendors.vendorId": vendorId }).populate(
      "userId"
    );

    // Filter to vendor-specific pending items
    const vendorOrders = orders
      .map((order) => {
        const vendorBlock = order.vendors.find(
          (v) =>
            v.vendorId.toString() === vendorId.toString() &&
            v.status === "Pending"
        );

        if (!vendorBlock) return null;

        return {
          _id: order._id,
          userId: order.userId,
          name: order.name,
          phone: order.phone,
          address: order.address,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          items: vendorBlock.items,
          totalAmount: vendorBlock.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          status: vendorBlock.status,
        };
      })
      .filter(Boolean); // Remove nulls

    res.render("vendorpending", {
      orders: vendorOrders,
      vendorId: req.session.user._id,
    });
  } catch (error) {
    console.error("❌ Error fetching pending orders:", error);
    res.status(500).send("Error fetching pending orders");
  }
};
const completeOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const vendorId = req.session.user._id;
    console.log("🔎 Received orderId:", req.body.orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send("Invalid Order ID");
    }
    // 🔍 Find the order with the vendor in the vendors array
    const order = await Order.findOne({
      _id: orderId,
      "vendors.vendorId": vendorId,
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // 🎯 Find the correct vendor section inside the vendors array
    const vendorSection = order.vendors.find(
      (v) => v.vendorId.toString() === vendorId.toString()
    );

    if (!vendorSection) {
      return res
        .status(403)
        .send("You are not authorized to complete this order");
    }

    if (vendorSection.status === "Completed") {
      return res.status(400).send("Order already completed by this vendor");
    }

    // ✅ Update only this vendor’s status
    vendorSection.status = "Completed";
    vendorSection.completedAt = new Date();

    await order.save();

    res.redirect("vendorcomplete");
  } catch (error) {
    console.error("❌ Error completing order:", error);
    res.status(500).send("Error completing order11111111111111111111111111111");
  }
};
const getVendorDashboard = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "vendor") {
      return res.redirect("/login");
    }

    const vendorId = req.session.user._id;

    // Fetch vendor's products
    const products = await Product.find({ vendorId });

    // Fetch all orders that include this vendor
    const orders = await Order.find({ "vendors.vendorId": vendorId });

    let pendingCount = 0;
    let completedCount = 0;
    let totalSales = 0;

    orders.forEach((order) => {
      const vendorData = order.vendors.find(
        (v) => v.vendorId.toString() === vendorId.toString()
      );
      if (vendorData) {
        if (vendorData.status === "Pending") {
          pendingCount++;
        } else if (vendorData.status === "Completed") {
          completedCount++;
          vendorData.items.forEach((item) => {
            totalSales += item.price * item.quantity;
          });
        }
      }
    });

    const rating = 4.6; // Optional placeholder

    res.render("vendor", {
      title: "Vendor Dashboard",
      products,
      pendingCount,
      completedCount,
      totalSales: totalSales || 0,
      rating,
    });
  } catch (error) {
    console.error("Error loading vendor dashboard:", error);
    res.status(500).send("Failed to load dashboard");
  }
};

module.exports = {
  AddItems,
  UpdateItems,
  DeleteItems,
  getPendingOrders,
  completeOrder,
  getVendorDashboard,
};
