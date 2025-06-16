const express = require("express");
const Router = express.Router();
const Product = require("../models/productschema");

//  get product by category and subcategory
Router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const filters = { category };

    // Apply subcategory filter 
    if (req.query.subcategory) {
        filters.subcategory = { $in: req.query.subcategory.split(",") };
    }

    // price filter is applied correctly???
    if (req.query.minPrice && req.query.maxPrice) {
        filters.price = {
            $gte: parseInt(req.query.minPrice, 10),
            $lte: parseInt(req.query.maxPrice, 10),
        };
    }

    // Fetch products by category and filters
    const products = await Product.find(filters);
    const bestsellerProducts = await Product.find({ category, bestseller: true });
    const subcategories = await Product.distinct("subcategory", { category });

    const maxPriceProduct = await Product.findOne({ category }).sort({ price: -1 });
    const maxPrice = maxPriceProduct ? maxPriceProduct.price : 5000; // Default if no products

    //Always return maxPrice
    if (req.xhr) {
      return res.json({ products, maxPrice });
    }
    res.render("category", {
        categoryName: category,
        products,
        subcategories,
        bestsellerProducts,
        maxPrice,
        isSearchPage: false,
    });

} catch (err) {
    console.error("Error loading category:", err);
    res.status(500).send("Error loading category");
}
});


Router.get("/search",async(req,res)=>{
   try {const query=req.query.q;
    if(!query) return res.redirect('/');
    console.log("Selected query is ",query);

    const products = await Product.find({
      $or: [
          { name: { $regex: query, $options: "i" } }, // Search by product name
          { category: { $regex: query, $options: "i" } }, // Search by category
          { subcategory: { $regex: query, $options: "i" } } // Search by subcategory
      ]
  });
    console.log("product found ",products)
    const bestsellerProducts = await Product.find({ name: { $regex: query, $options: "i" }, bestseller: true });
    const subcategories = await Product.distinct("subcategory", { name: { $regex: query, $options: "i" } });

    const maxPriceProduct = await Product.findOne({ name: { $regex: query, $options: "i" } }).sort({ price: -1 });
    const maxPrice = maxPriceProduct ? maxPriceProduct.price : 5000; // Default if no products
    res.render("category", {
        categoryName: `Search Results for "${query}"`, // Dynamic title
        products,
        subcategories,
        bestsellerProducts,
        maxPrice,
        isSearchPage: true, // Pass a flag for conditional logic in EJS
      });}
      catch(error){
        console.log(error);
      }
})

module.exports = Router;

