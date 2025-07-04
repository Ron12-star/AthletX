const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserSchema");
const cloudinary = require("../config/cloudinary");
const updateProfile = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    console.log("hello from profileupdate.js");
    const { name, password, location, phone } = req.body;
    const email = req.session.user.email;
    console.log("Received form data:", req.body);
    // Important log
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    user.name = name || user.name;
    user.location = location || user.location;
    user.phone = phone || user.phone;
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }
    if (req.file && req.file.path) {
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "athletex/profiles",
      });
      user.image = cloudinaryRes.secure_url; // ✅ Only save the URL
    }
    console.log("Received file:", req.file); 
    if (req.file && req.file.path) {
      console.log("Uploading to Cloudinary:", req.file.path); // <-- Add this

      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "athletex/profiles",
      });

      console.log("Cloudinary response:", cloudinaryRes); // <-- Add this

      user.image = cloudinaryRes.secure_url;
    }

    await user.save();
    // Update session (without password)
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    req.session.user = { ...userWithoutPassword, loggedIn: true };
    console.log("Profile updated:", userWithoutPassword);
    res.redirect("/profile");
  } catch (err) {
  console.error("Update Profile Error:", err); // See full error in console
  res.status(500).send(`<pre>${JSON.stringify(err, null, 2)}</pre>`);
}

};
module.exports = updateProfile;
