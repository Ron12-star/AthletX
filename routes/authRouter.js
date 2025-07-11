const express = require("express");
const router = express.Router();
const { signup } = require("../controller/Signup");
const { Login } = require("../controller/Login.js");
const { User } = require("../controller/UserDashboard.js");
const {logout}=require("../controller/logout.js");
const {HomePageItem}=require("../controller/itemsAthomepage.js");
const updateProfile=require("../controller/profileupdate.js");
const upload=require("../middleware/upload.js");
const getProfile=require("../controller/profile.js");
router.post("/signup", signup);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", Login);
router.get("/user-dashboard", User);
router.get("/logout",logout );
router.post('/logout',logout);
router.get("/", HomePageItem);
router.get("/profile", getProfile);
router.post("/profile/update",upload.single("image"),updateProfile)
router.get('/session-status', (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      user: {
        _id: req.session.user._id,
        email: req.session.user.email,
        role: req.session.user.role,
      },
    });
  } else {
    res.json({ loggedIn: false });
  }
});
module.exports = router;
