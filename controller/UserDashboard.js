const express = require("express");

const User=(req, res) => {
  if (!req.session.user || req.session.user.role !== "user") {
    return res.send("Access Denied! from user");
  }
  res.redirect('/'); 
}
module.exports={User};