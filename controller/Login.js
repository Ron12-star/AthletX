const User = require("../models/UserSchema.js");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("reached here");
    if (!user) return res.status(400).send("Invalid credentials")

    if (!role || user.role.toLowerCase() !== role.toLowerCase()) {
      console.log("reached inside")
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }
    console.log('reached here');
    console.log("Entered password:", password);
    const tempHashedPassword = await bcrypt.hash(password, 10);
    console.log("Type of entered password:", typeof password);
    console.log("Stored hash:", user.password);
    console.log("password",tempHashedPassword)
    const matched = await bcrypt.compare(String(password), user.password);
    console.log("matched",matched);
    if (!matched) {
      console.log("Invalid password");
      return res.send(`
        <script>
        alert('Invalid credential');
        window.location.href="/Login";
        </script>
        `);
      alert("password did not match");
    }


    
    req.session.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      loggedIn: true,
    };
    console.log("Session started:", req.session.user);
    req.session.save((err) => {
      if (err) {
        console.log("Session Save error", err);
        return res.send("Error saving session");
      }
      return res.redirect(
        user.role === "vendor" ? "/vendor-dashboard" : "/user-dashboard"
      );
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { Login };
