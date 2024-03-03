const Joi = require("joi"); // for server side validation validating listing
const ExpressError = require("./ExpressError.js");

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

//function for validating listing

const validateListing = (req, res, next) => {
  console.log("Validate listing called");
  console.log(req.body);
  let error = listingSchemaa.validate(req.body);
  console.log(error);
  console.log("error is being called");
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "error");
  // } isko replace kia hae neeche wale ne
  if (error.error) {
    let errMessage = error.error.details[0].message;
    console.log(errMessage);
    throw new ExpressError(400, errMessage);
  } else {
    console.log("next is being called");
    next();
  }
};

//joi schema to validate reviews

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }),
});

//function for validating reviews

const validateReview = (req, res, next) => {
  console.log("I am logging validateReview");
  console.log(req.body);
  let error = reviewSchema.validate(req.body);
  console.log(error);
  console.log("error is being called");

  if (error.error) {
    let errMessage = error.error.details[0].message;
    console.log("I am throwing error");
    console.log(errMessage);
    throw new ExpressError(400, errMessage);
  } else {
    console.log("next is being called");
    next();
  }
};

module.exports = { validateListing, validateReview };
