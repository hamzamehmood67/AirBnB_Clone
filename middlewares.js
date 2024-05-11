
const Listing= require("./models/listing")
const Review= require("./models/review")
const { reviewSchema } = require(`./schema.js`); ///to validate data by joi 
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

const isOwner= async(req, res, next)=>{
  let { id } = req.params;
    let list=await Listing.findById(id);
    if(!res.locals.currUser._id.equals(list.owner._id))
    {
      req.flash("error", "You are not allowed to access this")
      return res.redirect(`/listings/${id}`);
    }
    next();
}
const isReviewOwner= async(req, res, next)=>{
  let { id, reviewId } = req.params;
    let re=await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(re.author._id))
    {
      req.flash("error", "You are not allowed to access this")
      return res.redirect(`/listings/${id}`);
    }
    next();
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error)
      throw new ExpressError(400, error);
  else
      return next();
}
module.exports = { isValid, saveRedirectUrl, isOwner, isReviewOwner, validateReview };
