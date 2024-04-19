const express = require("express")
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require(`../schema.js`); ///to validate data by joi 
const review = require(`../models/review.js`);  ///requiring the review models for storing review
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...
const Listing = require("../models/listing"); // Database models



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error)
        throw new ExpressError(400, error);
    else
        return next();
}



//reviewss
router.post('/', validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body.review);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review save");
    req.flash('succes', 'New review is added!')
    res.redirect(`/listings/${req.params.id}`)

}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('succes', 'Review is deleted!')
    res.redirect(`/listings/${id}`)
}))

module.exports = router;