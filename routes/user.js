const express = require(`express`);
const wrapAsync = require("../utils/wrapAsync");
const User = require(`../models/user.js`);
const passport = require(`passport`);
const { saveRedirectUrl } = require("../middlewares.js");
const router = express.Router();

const userController= require("../controller/user.js");

router.get(`/signup`,userController.showSignUpForm );
router.get(`/login`, userController.showLoginForm);

router.post(
  `/signup`,
  wrapAsync(userController.addUser)
);

router.post(
  `/login`,
  saveRedirectUrl,
  passport.authenticate(`local`, {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.loginUser)
);

router.get(`/logout`, userController.logout);

module.exports = router;
