const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// Function to connect to DB

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Connecting to DB

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

//Root Route

app.get("/", (req, res) => {
  res.send("Working");
});

//For all Listings

app.get("/listings", async (req, res) => {
  allListings = await Listing.find({});
  res.render("./listing/index.ejs", { allListings });
});

//Form send for New Listing

app.get("/listings/new", (req, res) => {
  res.render("./listing/new.ejs");
});

// Read-Show Route

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listing/show.ejs", { listing });
});

// Edit Form Sent for Update Route

app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listing/edit.ejs", { listing });
});

//Update Route in DB

app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  let newListing = new Listing(data);
  await Listing.findByIdAndUpdate(id, { ...data });
  res.redirect(`/listings/${id}`);
});

//For saving New Listing to DB

app.post("/listing", async (req, res) => {
  let data = req.body;
  let newListing = new Listing(data);
  await newListing.save();
  res.redirect("/listings");
});

// Delete Route

app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  res.redirect("/listings");
});

app.listen(8080, (res) => {
  console.log("listening");
});
