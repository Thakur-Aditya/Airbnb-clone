const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../utils/schema.js"); //joi schema to validate listing
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js"); //middleware for authentication
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //

router
  .route("/")
  .get(wrapAsync(listingController.listing)) //for all listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.savingNewListing) //for saving new listing
  );

//Form send for New Listing
router.get("/new", isLoggedIn, listingController.newListingForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showRoute)) //show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //delete route

// Edit Form Sent for Update Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;
