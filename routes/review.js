const express = require("express")
const router = express.Router({ mergeParams: true });

const review = require(`../models/review.js`);  ///requiring the review models for storing review
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...
const Listing = require("../models/listing"); // Database models
const {isValid, isReviewOwner, validateReview}= require("../middlewares.js")  //To check user is Logged In and review is 

const reviewController= require("../controller/reviews.js");



//reviewss
router.post('/', isValid, validateReview, wrapAsync(reviewController.addReview));

router.delete('/:reviewId', isReviewOwner, wrapAsync(reviewController.deleteReview))

module.exports = router;