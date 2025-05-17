const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure parent params are accessible (id accessible in review)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const listingController = require("../controllers/reviews.js");
// Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(listingController.createReview));

// Delete Review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(listingController.destroyReview));

module.exports = router;