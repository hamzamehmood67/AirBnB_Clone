const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Database models
const path = require(`path`); //to join path of static files
const methodOverride = require(`method-override`); //to send put post patch request from form
const ejsMate = require(`ejs-mate`); //To make layouts boilerplate in ejs
const wrapAsync = require(`./utils/wrapAsync.js`); //to handle custom errors...
const ExpressError = require(`./utils/ExpressError.js`); //to handle custom errors...
const Joi = require('joi'); //to valide data from user
const listingSchema = require(`./schema.js`);
const app = express();

app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `views`));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(`_method`));
app.use(express.static(path.join(__dirname, `/public`)));
app.engine(`ejs`, ejsMate);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  console.log("Connected Successfully to database");
}
main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Runing");
});

//Middleware
const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error)
    throw new ExpressError(400, error);
  else
    return next();
}







app.get(
  `/listings`,
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render(`./listings/index.ejs`, { allListings });
  })
);

app.get(`/listings/new`, (req, res) => {
  res.render(`./listings/newListing.ejs`);
});

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("./listings/show.ejs", { list: listing });
  })
);

app.post(
  `/listings`, validateListings,
  wrapAsync(async (req, res) => {


    let listing = req.body.lisitng;
    let newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect(`/listings`);
  })
);

app.get(
  `/listings/:id/edit`,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);

    res.render(`./listings/edit.ejs`, { list: list });
  })
);

app.put(
  `/listings/:id`, validateListings,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.lisitng });
    res.redirect(`/listings/${id}`);
  })
);

app.delete(
  `/listings/:id`,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  })
);
app.all(`*`, (req, res, next) => {
  next(new ExpressError(404, `Page Not found`));
});

app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render(`./listings/Error`, { message });
});

app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
