const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  console.log("Connected Successfully to database");
}

main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Runing");
});

app.get("/testL", async (req, res) => {
  let newList = new Listing({
    title: "AKhuwat College Kasur",
    description: "BSIT & BSECO",
    price: 15999,
    location: "Kasur Punjab",
    country: "Pakistan",
  });

  await newList.save();
  res.send("Data Save");
});

app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
