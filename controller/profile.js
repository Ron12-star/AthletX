const User = require("../models/UserSchema");

const getProfile = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    if (!req.session.user) return res.redirect("/login");

    try {
      const user = await User.findOne({ email: req.session.user.email });
      if (!user) return res.status(404).send("User not found");

      const { password, ...userWithoutPassword } = user.toObject(); // Remove sensitive data
      res.render("profile", { user: userWithoutPassword });
    } catch (err) {
      console.error("Error loading profile:", err);
      res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    console.log("error loading profile!", err);
    res.status(500).send("interal server error");
  }
};

module.exports=getProfile;