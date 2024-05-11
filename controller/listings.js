const Listing = require("../models/listing"); // Database models

module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render(`./listings/index.ejs`, { allListings });
  }

  module.exports.showForm=(req, res) => {
    res.render(`./listings/newListing.ejs`);
  }

  module.exports.showSingleListing= async (req, res) => {
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
  }

  module.exports.postNewListing=async (req, res) => {
    let listing = req.body.lisitng;
    let newlisting = new Listing(listing);
    console.log(req.user);
    newlisting.owner = req.user._id;

    await newlisting.save();
    req.flash("succes", "New Place is added successfully");
    res.redirect(`/listings`);
  }

  module.exports.editListing= async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Lisiting you requested for does not exist");
      res.redirect("/listings");
    }
   
    
    res.render(`./listings/edit.ejs`, { list: list });
  }

  module.exports.changeListing= async (req, res) => {
    let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.lisitng });
    req.flash("succes", "Listing is Updated");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing= async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("succes", "Listing is deleted!");
    res.redirect(`/listings`);
  }