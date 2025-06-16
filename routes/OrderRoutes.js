const express = require("express");
const Router = express.Router();
const {checkoutPage,placeorder,getOrderConfirmation,getUserOrdersWithStatus}=require("../controller/order.js");


Router.get('/checkout',checkoutPage);
Router.post('/place-order',placeorder);
Router.get('/order-confirmation',getOrderConfirmation);
// Router.get('/latest-order',getLatestOrder);
Router.get('/order-status', getUserOrdersWithStatus);

module.exports=Router;