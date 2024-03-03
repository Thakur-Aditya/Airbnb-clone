const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  console.log("i am being called");
  let { id } = req.params;
  let response = req.body;
  let listing1 = await Listing.findById(id);
  let review = new Reviews({
    rating: response.review.rating,
    comment: response.review.comment,
    author: req.user._id,
  });
  listing1.reviews.push(review);
  await review.save();
  await listing1.save();
  req.flash("success", "New Review Created Successfully");
  res.redirect(`/listings/${listing1._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //finds and deletes reviewId from array
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
