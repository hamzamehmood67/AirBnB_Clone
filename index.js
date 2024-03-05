const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require(`path`);
const methodOverride = require(`method-override`);
const ejsMate = require(`ejs-mate`);
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

app.get(`/listings`, async (req, res) => {
  const allListings = await Listing.find({});
  res.render(`./listings/index.ejs`, { allListings });
});

app.get(`/listings/new`, (req, res) => {
  res.render(`./listings/newListing.ejs`);
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  res.render("./listings/show.ejs", { list: listing });
});

app.post(`/listings`, async (req, res) => {
  let listing = req.body.lisitng;
  let newlisting = new Listing(listing);
  await newlisting.save();
  res.redirect(`/listings`);
});

app.get(`/listings/:id/edit`, async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);

  res.render(`./listings/edit.ejs`, { list: list });
});

app.put(`/listings/:id`, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.lisitng });
  res.redirect(`/listings/${id}`);
});

app.delete(`/listings/:id`, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
});

app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
