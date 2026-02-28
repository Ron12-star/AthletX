const express = require("express");// Main framework to build web app and apis
const path = require("path");//Built in nodej module to handle file and directory path
const connectDB = require("./Database/DB.js");//custom function that help to connect with database
const session = require("express-session");//middleware to store user session(used for authentication and cart)

//built in function
const authRouter = require("./routes/authRouter.js");
const vendorRouter=require("./routes/vendorRouter.js");
const CartRouter=require("./routes/cartRouter.js");
const WishListRouter=require("./routes/WishlistRouter.js");
const CategoryRouter=require("./routes/CategoryRouter.js");
const OrderRouter=require('./routes/OrderRoutes.js');

const app = express(); //express application
require("dotenv").config(); //load environment variables

app.use(express.urlencoded({ extended: true })); //parses form data
app.use(express.json());//parses json data


//session middleware
app.use(
  session({
    secret:  process.env.SESSION_SECRET, //encryption key for session
    resave: false, //prevent resaving session if nothing change in session
    saveUninitialized: false, //prevent saving empty session
    cookie: { secure: false,maxAge:24*60*60*1000 },
    
  })
);


//Server static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));
//set view engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));







//connection with mongoDB
connectDB();
//Routes
app.use("/", authRouter);
app.use("/vendor-dashboard",vendorRouter);
app.use("/add-to-cart",CartRouter);
app.use("/Wishlist",WishListRouter)
app.use("/",CategoryRouter);
app.use("/",OrderRouter);
const products = {
  WinterCollection: [
      { name: "Winter Jacket", image: "/images/winter-jacket.jpg", details: "Warm and cozy", price: 1999, discount: 10 },
  ],
  Men: [
      { name: "Men's T-Shirt", image: "/images/men-tshirt.jpg", details: "Cotton T-Shirt", price: 499, discount: 5 },
  ],
  Women: [
      { name: "Women's Jacket", image: "/images/women-jacket.jpg", details: "Stylish winter jacket", price: 2499, discount: 15 },
  ],
  Kids: [
      { name: "Kids Sweater", image: "/images/kids-sweater.jpg", details: "Soft wool sweater", price: 999, discount: 20 },
  ],
  Shoes: [
      { name: "Running Shoes", image: "/images/shoes.jpg", details: "Lightweight & Comfortable", price: 1499, discount: 12 },
  ],
  Equipment: [
      { name: "Football", image: "/images/football.jpg", details: "Best quality football", price: 799, discount: 8 },
  ],
  Bags: [
      { name: "Travel Backpack", image: "/images/bag.jpg", details: "Spacious and durable", price: 1299, discount: 10 },
  ],
  Accessories: [
      { name: "Sunglasses", image: "/images/accessories.jpg", details: "UV Protection", price: 699, discount: 5 },
  ],
};

// Dynamic Category Route
app.get('/category/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName; // Get category from URL
  const categoryProducts = products[categoryName] || []; // Fetch related products
  res.render('category', { categoryName: categoryName, products: categoryProducts });
});
app.get("/signup", (req, res) => res.render("signup.ejs"));
app.get("/login", (req, res) => res.render("login.ejs"));

const PORT = 7777;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
