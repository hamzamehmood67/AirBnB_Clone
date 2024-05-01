const express = require(`express`);
const wrapAsync = require("../utils/wrapAsync");
const User = require(`../models/user.js`);
const passport = require(`passport`);
const router = express.Router();

router.get(`/signup`, (req, res) => {
  res.render("./user/signup.ejs");
});
router.get(`/login`, (req, res) => {
  res.render("./user/signin.ejs");
});

router.post(
  `/signup`,
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);

      req.flash(`succes`, `Welcome to AirBnb`);
      res.redirect(`/listings`);
    } catch (err) {
      req.flash(`error`, err.message);
      res.redirect(`/signup`);
    }
  })
);

router.post(
  `/login`,
  passport.authenticate(`local`, {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash(`succes`, `Welcom to AirBnb`);
    res.redirect(`/listings`);
  })
);

router.get(`/logout`, (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);

    req.flash(`succes`, `Log out successfully`);
    res.redirect(`/listings`);
  });
});

module.exports = router;
