const Listing = require("../models/listing"); // Database models
const review = require(`../models/review.js`);  ///requiring the review models for storing review

module.exports.addReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body.review);
    let newReview = new review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review save");
    req.flash('succes', 'New review is added!')
    res.redirect(`/listings/${req.params.id}`)

}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('succes', 'Review is deleted!')
    res.redirect(`/listings/${id}`)
}