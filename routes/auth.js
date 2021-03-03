const express = require("express");
const router = express.Router();
const UserModel = require("./../model/User"); //Path to UserModel

//* Get signin form
router.get("/signin", (req, res, next) => {
  res.render("signin.hbs");
});

//* Get signup form
router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

//* Get signout
router.get("/signout", (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect("signin.hbs");
  });
});

// router.post("/signout", (req, res, next) => {
//   req.session.destroy();
//   res.redirect("signin.hbs");
// });

//* Post signin
router.post("/signin", async (req, res, next) => {
  const { userName, email, password, role, avatar } = req.body;
  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signin");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Invalid credentials");
      res.redirect("/signin");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password; // remove password before saving user in session
      // console.log(req.session, "before defining current user");
      req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)

      // https://www.youtube.com/watch?v=nvaE_HCMimQ
      // https://www.youtube.com/watch?v=OFRjZtYs3wY

      req.flash("success", "Successfully logged in...");
      res.redirect("/profile");
    }
  }
});

module.exports = router;
