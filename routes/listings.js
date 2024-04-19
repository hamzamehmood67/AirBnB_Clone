const Listing = require("../models/listing"); // Database models
const wrapAsync = require(`../utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`../utils/ExpressError.js`); //to handle custom errors...
const { listingSchema} = require(`../schema.js`); ///to validate data by joi 


const express = require("express");
const router = express.Router();

const validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error)
        throw new ExpressError(400, error);
    else
        return next();
}


router.get(
    `/`,
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render(`./listings/index.ejs`, { allListings });
    })
);

router.get(`/new`, (req, res) => {
    res.render(`./listings/newListing.ejs`);
});

router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate('reviews');

        res.render("./listings/show.ejs", { list: listing });
    })
);

router.post(
    `/`, validateListings,
    wrapAsync(async (req, res) => {


        let listing = req.body.lisitng;
        let newlisting = new Listing(listing);
        await newlisting.save();
        req.flash('succes', 'New Place is added successfully')
        res.redirect(`/listings`);
    })
);

router.get(
    `/:id/edit`,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let list = await Listing.findById(id);

        res.render(`./listings/edit.ejs`, { list: list });
    })
);

router.put(
    `/:id`, validateListings,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.lisitng });
        res.redirect(`/listings/${id}`);
    })
);

router.delete(
    `/:id`,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect(`/listings`);
    })
);

module.exports = router;