const express = require("express");
const Router = express.Router();
const Product = require("../models/productschema");

//get product by category and subcategory
Router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const minPriceQuery = parseInt(req.query.minPrice);
    const maxPriceQuery = parseInt(req.query.maxPrice);

    let pipeline = [];

    //Match category
    pipeline.push({
      $match: { category },
    });

    //Apply subcategory filter
    if (req.query.subcategory) {
      pipeline.push({
        $match: {
          subcategory: { $in: req.query.subcategory.split(",") },
        },
      });
    }

    //Add discounted price field
    pipeline.push({
      $addFields: {
        finalPrice: {
          $subtract: [
            "$price",
            {
              $multiply: ["$price", { $divide: ["$discount", 100] }],
            },
          ],
        },
      },
    });

    //Filter using discounted price
    if (!isNaN(minPriceQuery) && !isNaN(maxPriceQuery)) {
      pipeline.push({
        $match: {
          finalPrice: {
            $gte: minPriceQuery,
            $lte: maxPriceQuery,
          },
        },
      });
    }

    //Get products
    const products = await Product.aggregate(pipeline);

    //keep other logic same
    const bestsellerProducts = await Product.find({
      category,
      bestseller: true,
    });
    const subcategories = await Product.distinct("subcategory", { category });

    //maxPrice must also be based on discounted price
    const maxPriceProduct = await Product.aggregate([
      { $match: { category } },
      {
        $addFields: {
          finalPrice: {
            $subtract: [
              "$price",
              {
                $multiply: ["$price", { $divide: ["$discount", 100] }],
              },
            ],
          },
        },
      },
      { $sort: { finalPrice: -1 } },
      { $limit: 1 },
    ]);

    const maxPrice =
      maxPriceProduct.length > 0 ? maxPriceProduct[0].finalPrice : 5000;

    //Ajax response
    if (req.xhr) {
      return res.render("productcard", { products });
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

Router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.redirect("/");
    console.log("Selected query is ", query);

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, //Search by product name
        { category: { $regex: query, $options: "i" } }, //Search by category
        { subcategory: { $regex: query, $options: "i" } }, //Search by subcategory
      ],
    });
    console.log("product found ", products);
    const bestsellerProducts = await Product.find({
      name: { $regex: query, $options: "i" },
      bestseller: true,
    });
    const subcategories = await Product.distinct("subcategory", {
      name: { $regex: query, $options: "i" },
    });

    const maxPriceProduct = await Product.findOne({
      name: { $regex: query, $options: "i" },
    }).sort({ price: -1 });
    const maxPrice = maxPriceProduct ? maxPriceProduct.price : 5000; //Default if no products
    res.render("category", {
      categoryName: `Search Results for "${query}"`, //Dynamic title
      products,
      subcategories,
      bestsellerProducts,
      maxPrice,
      isSearchPage: true, //Pass a flag for conditional logic in EJS
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
