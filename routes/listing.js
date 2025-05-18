const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Router.Route for path "/"
router.route("/")
    //Index Route
    .get(wrapAsync(listingController.index))//In this we have to avoid semicolon
    //Create Route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.route for path "/:id"
router.route("/:id")
    //Show Route
    .get(wrapAsync(listingController.showListing))
    //Update Route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    //Delete Listing Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;