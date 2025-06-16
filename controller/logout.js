const logout=(req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.send("error logging out");
      } else {
        res.clearCookie("connect.sid");
        console.log("session destroy")
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
}

module.exports={logout};