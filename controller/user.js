const User = require(`../models/user.js`);

module.exports.showSignUpForm=(req, res) => {
    res.render("./user/signup.ejs");
  }

module.exports.showLoginForm= (req, res) => {
    res.render("./user/signin.ejs");
  }

  module.exports.addUser= async (req, res) => {
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
  }

  module.exports.loginUser=async (req, res) => {
    req.flash(`succes`, `Welcom to AirBnb`);
    //this is bcz when we login from home page it gives page not found
    //bcz when user login form home isValid middleware is not triggered
    console.log(res.locals.redirectUrl)
    let redirectURL = res.locals.redirectUrl || `/listings`;
    res.redirect(redirectURL);
  }

  module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
      if (err) return next(err);
  
      req.flash(`succes`, `Log out successfully`);
      res.redirect(`/listings`);
    });
  }