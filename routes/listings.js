const Listing = require("../models/listing"); // Database models
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...
const { listingSchema } = require(`../schema.js`); ///to validate data by joi
const { isValid, isOwner } = require(`../middlewares.js`);
const listingController= require("../controller/listings.js"); 
const express = require("express");
const router = express.Router();

const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) throw new ExpressError(400, error);
  else return next();
};

//index route
router.get(
  `/`,
  wrapAsync(listingController.index)
);
//New Listing
router.get(`/new`, isValid, listingController.showForm);

//show single listing
router.get(
  "/:id",
  wrapAsync(listingController.showSingleListing)
);

router.post(
  `/`,
  validateListings,
  wrapAsync(listingController.postNewListing)
);

router.get(
  `/:id/edit`, isOwner,
  isValid,
  wrapAsync(listingController.editListing)
);

router.put(
  `/:id`, isOwner,
  validateListings, 
  wrapAsync(listingController.changeListing)
);

router.delete(
  `/:id`,
  isOwner,
  isValid,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
