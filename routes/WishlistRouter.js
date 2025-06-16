const express=require('express');
const Router=express.Router();
const {addToWishList,getWishlist,removeFromWishlist,moveToCart}=require('../controller/WishlistController');
const {isUserLoggedIn}=require("../middleware/authmiddleware");

Router.get("/",isUserLoggedIn,getWishlist);
Router.post("/",isUserLoggedIn,addToWishList);
Router.post("/add-to-cart", isUserLoggedIn, moveToCart);
Router.delete("/remove/:productId",isUserLoggedIn,removeFromWishlist);

module.exports=Router;