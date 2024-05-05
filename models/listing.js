// const { string, object } = require("joi");
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: Object,
    default:
      "https://www.istockphoto.com/photo/luxurious-villa-with-pool-gm506903162-84462663",
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
