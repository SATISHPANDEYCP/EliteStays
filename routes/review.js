const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure parent params are accessible (id accessible in review)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");

// Reviews
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created successfully.");
    req.flash("error", "review not created successfully.");
    res.redirect(`/listings/${listing._id}`);
}));
    
// Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted successfully.");
    req.flash("error", "Something went wrong while deleting the review.");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;