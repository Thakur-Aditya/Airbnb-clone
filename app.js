const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchemaa } = require("./utils/schema.js");
const { wrap } = require("module");
const Joi = require("joi");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

const listingSchemaa = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

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

const validateListing = (req, res, next) => {
  let error = listingSchemaa.validate(req.body);
  console.log(error);
  console.log("error is being called");
  if (error.error) {
    console.log("I am throwing error");
    throw new ExpressError(400, "finally");
  } else {
    console.log("next is being called");
    next();
  }
};
//Root Route

app.get("/", (req, res) => {
  res.send("Working");
});

//For all Listings

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
  })
);

//Form send for New Listing

app.get("/listings/new", (req, res) => {
  res.render("./listing/new.ejs");
});

// Read-Show Route

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/show.ejs", { listing });
  })
);

// Edit Form Sent for Update Route

app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
  })
);

//Update Route in DB

app.put(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "bhosdike aaukaat me reh le");
    }
    let { id } = req.params;
    let data = req.body;
    let newListing = new Listing(data);
    await Listing.findByIdAndUpdate(id, { ...data });
    res.redirect(`/listings/${id}`);
  })
);

//For saving New Listing to DB

app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "bhosdike aaukaat me reh le");
    // }
    // let error = listingSchemaa.validate(req.body);
    // console.log(error.error);
    // if (error.error) {
    //   throw new ExpressError(400, error.error);
    // }

    let data = req.body;
    let newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Delete Route

app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    res.redirect("/listings");
  })
);

//for all other false routes
app.all("*", (res, req, next) => {
  next(new ExpressError(404, "Page not found"));
});
//middleware for error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Sometiong Went wrong" } = err;
  //   res.status(statusCode).send(message);
  res.render("error.ejs", { message });
  // res.send("Something went wrong");
});

app.listen(8080, (res) => {
  console.log("listening");
});
