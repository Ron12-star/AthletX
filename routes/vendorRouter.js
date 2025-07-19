const express=require("express");
const router=express.Router();

const {vendorAuth}=require("../middleware/authmiddleware.js");
const {AddItems,UpdateItems,DeleteItems,getPendingOrders,
  completeOrder,getVendorDashboard}=require("../controller/vendorcontroller/vendoractivity.js")
  const Order=require("../models/OrderSchema.js");
const upload=require("../multer/multer.js")
// router.get("/vendor-dashboard", vendorAuth, getVendorDashboard);
router.get("/",vendorAuth,getVendorDashboard);

router.post("/add", vendorAuth,upload.single("image"),AddItems );
router.put("/update/:id", vendorAuth,UpdateItems );
router.delete("/delete/:id", vendorAuth,DeleteItems );

// Pending Orders (GET /vendor-dashboard/orders)
router.get("/orders", vendorAuth, getPendingOrders);

// Complete Order (POST /vendor-dashboard/orders/complete)
router.post("/orders/vendorcomplete", vendorAuth, completeOrder);


// Completed Orders (GET /vendor-dashboard/orders/completed)
router.get("/orders/vendorcomplete", vendorAuth, async (req, res) => {
  try {
    const vendorId = req.session.user._id;

    //  Find orders  with status "Completed"
    const completedOrders = await Order.find({
      vendors: {
        $elemMatch: {
          vendorId: vendorId,
          status: "Completed"
        }
      }
    }).populate("userId");

    // Reshape data of vendor's items
    const vendorOrders = completedOrders.map(order => {
      const vendorBlock = order.vendors.find(
        v => v.vendorId.toString() === vendorId.toString() && v.status === "Completed"
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
        totalAmount: vendorBlock.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: vendorBlock.status,
        completedAt: vendorBlock.completedAt
      };
    }).filter(Boolean); // remove nulls

    res.render("vendorcomplete", { orders: vendorOrders, vendorId });
  } catch (error) {
    console.error(" Error fetching completed orders:", error);
    res.status(500).send("Failed to load completed orders");
  }
});



module.exports = router;