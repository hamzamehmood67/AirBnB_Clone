const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require(`path`);
const app = express();

app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `views`));
app.use(express.urlencoded({ extended: true }));

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

app.post(`/listings`, (req, res) => {
  let listing = req.body;
  console.log(listing);
  res.send(`Helo`);
});
app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
