const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Listing Route
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;