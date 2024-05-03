const express = require(`express`);
const wrapAsync = require("../utils/wrapAsync");
const User = require(`../models/user.js`);
const passport = require(`passport`);
const { saveRedirectUrl } = require("../middlewares.js");
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

      //to log in user auto after signup
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash(`succes`, `Welcome to AirBnb`);
        res.redirect(`/listings`);
      });
    } catch (err) {
      req.flash(`error`, err.message);
      res.redirect(`/signup`);
    }
  })
);

router.post(
  `/login`,
  saveRedirectUrl,
  passport.authenticate(`local`, {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash(`succes`, `Welcom to AirBnb`);
    //this is bcz when we login from home page it gives page not found
    //bcz when user login form home isValid middleware is not triggered
    let redirectURL = res.locals.redirectUrl || `/listings`;
    res.redirect(redirectURL);
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
