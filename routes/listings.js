const Listing = require("../models/listing"); // Database models
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...

const { isValid, isOwner, validateListings } = require(`../middlewares.js`);
const listingController= require("../controller/listings.js"); 
const express = require("express");
const router = express.Router();

// const validateListings = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   console.log(error);
//   if (error) throw new ExpressError(400, error);
//   else return next();
// };

router.route("/")
.get(wrapAsync(listingController.index)
)
.post( validateListings, wrapAsync(listingController.postNewListing)
)

//New Listing
router.get(`/new`, isValid, listingController.showForm);


router.route('/:id')  //to combine all routes of same path
.get(
  wrapAsync(listingController.showSingleListing)
)
.put( isOwner, validateListings, 
  wrapAsync(listingController.changeListing)
)
.delete(isOwner, isValid, wrapAsync(listingController.destroyListing));

router.get(
  `/:id/edit`, isOwner,
  isValid,
  wrapAsync(listingController.editListing)
);

module.exports = router;
