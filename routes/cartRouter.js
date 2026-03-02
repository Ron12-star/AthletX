const express=require("express");
const Router=express.Router();
const{addToCart,getCart,removeFromCart,updateCart}=require("../controller/cartroute.js");
const {isUserLoggedIn}=require("../middleware/authmiddleware.js");
//app.use("/add-to-cart",CartRouter); thats the server router
Router.get("/",isUserLoggedIn,getCart);
Router.post("/",isUserLoggedIn,addToCart);
Router.delete("/:productId",isUserLoggedIn,removeFromCart);
Router.post("/update-cart",isUserLoggedIn,updateCart)
module.exports=Router;