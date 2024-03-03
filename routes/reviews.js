const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../utils/schema.js"); //joi schema to validate listing
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isAuthor,
} = require("../middleware.js"); //middleware for authentication
const reviewController = require("../controllers/reviews.js");

//Add Reviews route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
