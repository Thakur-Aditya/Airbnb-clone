const Listing = require("../models/listing.js");

module.exports.listing = async (req, res) => {
  allListings = await Listing.find({});
  res.render("./listing/index.ejs", { allListings });
};

module.exports.newListingForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) //nested populate
    .populate("owner"); //taaki expand hoke aaye reviews
  if (!listing) {
    req.flash("success", "LIsting you want to find does not exist");
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you want to find does not exist");
    res.redirect("/listings");
  }
  res.render("./listing/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  console.log("Mere tak code aaya");
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  updatedListing.image = { url, filename };
  await updatedListing.save();
  }
  req.flash("success", "Listing Edited successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.savingNewListing = async (req, res, next) => {
  console.log("I am being called");
  let data = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url);
  console.log(filename);
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Saved");
  res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
