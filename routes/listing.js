const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

// Validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

//Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
});

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created successfully.");
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists.");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "New listing updated successfully.");
    req.flash("error", "Something went wrong while updating the listing.");
    res.redirect(`/listings/${id}`);
}));

//Delete Listing Route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "New listing deleted successfully.");
    req.flash("error", "Something went wrong while deleting the listing.");
    res.redirect("/listings");
});

module.exports = router;