const User = require("../models/UserSchema.js");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  console.log(req.body);
  const { email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }
    console.log("passowrd ",password)
    console.log("type of password",typeof password);
    const hashedPassword = await bcrypt.hash(String(password), 10); // Hash password
    console.log("🔐 Hashed password to store:", hashedPassword);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role,
    }); 

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { signup };
