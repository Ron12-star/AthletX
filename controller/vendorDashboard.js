const Product = require("../models/productschema.js");

const Vendor = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "vendor") {
    return res.redirect("/login"); // Redirect unauthorized users
  }

  try {
    const vendorId = req.session.user._id;
    console.log(vendorId);
    const products = await Product.find({ vendorId });

    res.render("vendor", { products: products || [] });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.render("vendor", { products: [] });
  }
};

module.exports = { Vendor };


