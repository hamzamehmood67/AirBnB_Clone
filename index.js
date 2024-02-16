const express = require("express");
const mongoose = require("mongoose");

const app = express();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
  console.log("Connected Successfully to database");
}

main().catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Runing");
});

app.listen(8080, () => {
  console.log("Server is listening at 8080");
});
