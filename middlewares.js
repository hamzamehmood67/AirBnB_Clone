const isValid = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    req.session.redirectURL = req.originalUrl;
    req.flash(
      `error`,
      `Please log in. You must be a valid user to perform this action`
    );
    res.redirect(`/login`);
  }
};

//This middleware use because passport reset the seesion when we login. thats why we //save this url to locals.
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectUrl = req.session.redirectURL;
  }

  return next();
};
module.exports = { isValid, saveRedirectUrl };
