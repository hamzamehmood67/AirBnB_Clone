const isValid = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    req.flash(
      `error`,
      `Please log in. You must be a valid user to perform this action`
    );
    res.redirect(`/login`);
  }
};

module.exports = { isValid };
