const Listing = require("../models/listing"); // Database models
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...
const { listingSchema } = require(`../schema.js`); ///to validate data by joi
const { isValid, isOwner } = require(`../middlewares.js`);
const express = require("express");
const router = express.Router();

const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) throw new ExpressError(400, error);
  else return next();
};

router.get(
  `/`,
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render(`./listings/index.ejs`, { allListings });
  })
);

router.get(`/new`, isValid, (req, res) => {
  res.render(`./listings/newListing.ejs`);
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: 'author'  //Nested population because inside review we have to populate author again
        }
      })
      .populate("owner");
 
    if (!listing) {
      req.flash("error", "Lisiting you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list: listing });
  })
);

router.post(
  `/`,
  validateListings,
  wrapAsync(async (req, res) => {
    let listing = req.body.lisitng;
    let newlisting = new Listing(listing);
    console.log(req.user);
    newlisting.owner = req.user._id;

    await newlisting.save();
    req.flash("succes", "New Place is added successfully");
    res.redirect(`/listings`);
  })
);

router.get(
  `/:id/edit`, isOwner,
  isValid,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Lisiting you requested for does not exist");
      res.redirect("/listings");
    }
   
    
    res.render(`./listings/edit.ejs`, { list: list });
  })
);

router.put(
  `/:id`, isOwner,
  validateListings, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.lisitng });
    req.flash("succes", "Listing is Updated");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  `/:id`,
  isOwner,
  isValid,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("succes", "Listing is deleted!");
    res.redirect(`/listings`);
  })
);

module.exports = router;
