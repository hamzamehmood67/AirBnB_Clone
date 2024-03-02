const data = require(`./data.js`);
const mongoose = require(`mongoose`);
const listings = require(`../models/listing.js`);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  console.log("Connected Successfully to database");
}

main().catch((err) => console.log(err));

const init = async () => {
  await listings.deleteMany({});
  await listings.insertMany(data.data);
  console.log(`Data was saved`);
};

init();
