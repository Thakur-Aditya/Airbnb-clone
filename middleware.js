const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

const isLoggedIn = (req, res, next) => {
  console.log("Is Logged in called");
  // console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    console.log("I am isLoggedIn");
    console.log(req.originalUrl);
    if (req.originalUrl) {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "You must be logged in before creating new listing");
    return res.redirect("/login");
  }
  next();
};

const redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    console.log("i am redirect url");
    console.log(req.session.redirectUrl);
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
  } else {
    next();
  }
};
const isOwner = async (req, res, next) => {
  console.log("is owner called");
  let { id } = req.params;
  let checkListing = await Listing.findById(id);
  console.log(checkListing.owner);
  console.log(res.locals.currentUser._id);
  if (!checkListing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not allowed to update this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let checkReview = await Review.findById(reviewId);
  console.log(checkReview);
  console.log(res.locals.currentUser._id);
  if (!checkReview.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not allowed to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = { isLoggedIn, redirectUrl, isOwner, isAuthor };

// module.exports.redirect = (req,res,next) => {
//   re
// }
