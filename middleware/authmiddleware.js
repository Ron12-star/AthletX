const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized! Please log in." });
  }
  next();
};
const vendorAuth = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "vendor") {
    return res.redirect("/login"); // Redirect if not logged in as vendor
  }
  next();
};
const isUserLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.render("login"); // Redirect if not logged in
  }
  next();
};

module.exports = { authMiddleware, vendorAuth ,isUserLoggedIn};