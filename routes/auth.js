const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("./../model/User"); //Path to UserModel

//* Get signin form
router.get("/signin", (req, res, next) => {
  res.render("auth/signin");
});

//* Get signup form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//* Get signout
router.get("/signout", (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect("signin");
  });
});

// router.post("/signout", (req, res, next) => {
//   req.session.destroy();
//   res.redirect("/signin");
// });

//* Post signin
router.post("/signin", async (req, res, next) => {
  const { userName, email, password, role, avatar } = req.body;
  const foundUser = await UserModel.findOne({ email: email });

  if (!foundUser) {
    req.flash("error", "Invalid credentials");
    res.redirect("/signin");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    console.log("same pwd:" + isSamePassword);
    if (!isSamePassword) {
      req.flash("error", "Invalid credentials");
      res.redirect("/signin");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password;
      req.session.currentUser = userObject;
      req.flash("success", "Successfully logged in...");
      res.redirect("/dashboard");
    }
  }
});

//* Post signup
router.post("/signup", async (req, res, next) => {
  try {
    const newUser = { ...req.body };
    const foundUser = await UserModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash("warning", "Email already registered");
      res.redirect("/auth/signup");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      const result = await UserModel.create(newUser);
      req.flash("success", "Congrats ! You are now registered !");
      res.redirect("/auth/signin");
    }
  } catch (err) {
    let errorMessage = "";
    for (field in err.errors) {
      errorMessage += err.errors[field].message + "\n";
    }
    req.flash("error", errorMessage);
    res.redirect("/auth/signup");
  }
});

module.exports = router;
