const express = require("express");
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware");
const listingController = require("../controllers/users.js");

// route.route for signup
router.route("/signup")
    .get(listingController.renderSignupForm)
    .post(wrapAsync(listingController.Signup));

// router.route for Login route
router.route("/login")
    .get(listingController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), listingController.login);

// logout
router.get("/logout", listingController.logout);

module.exports = router;