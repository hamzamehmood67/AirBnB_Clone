const express = require("express");
const mongoose = require("mongoose");

const path = require(`path`); //to join path of static files
const methodOverride = require(`method-override`); //to send put post patch request from form
const ejsMate = require(`ejs-mate`); //To make layouts boilerplate in ejs
const ExpressError = require(`./utils/ExpressError.js`); //to handle custom errors...
const session = require(`express-session`);  //for maintaining session for the website
const flash = require(`connect-flash`);

const app = express();

const sessionOptions={
  resave: false,
  secret: "myKey",
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7* 24 * 60 * 60 * 1000,
    maxAge: 7* 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

app.get("/", (req, res) => {
  res.send("Runing");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
  res.locals.succes= req.flash("succes");
  res.locals.error= req.flash("error");
  next();
})
const listings = require("./routes/listings.js");
const review = require("./routes/review.js");

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




app.use("/listings", listings);
app.use("/listings/:id/review", review);


//Error Handling Routes
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
