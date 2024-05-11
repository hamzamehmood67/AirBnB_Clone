const express = require(`express`);
const wrapAsync = require("../utils/wrapAsync");
const User = require(`../models/user.js`);
const passport = require(`passport`);
const { saveRedirectUrl } = require("../middlewares.js");
const router = express.Router();

const userController= require("../controller/user.js");

router.route('/login')
.get( userController.showLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate(`local`, {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.loginUser)
)

router.route('singup')
.get(userController.showSignUpForm )
.post(
  wrapAsync(userController.addUser)
);

router.get(`/logout`, userController.logout);

module.exports = router;
