const express = require("express");
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware");
const listingController = require("../controllers/users.js");

// route for signup page
router.get("/signup", listingController.renderSignupForm);

// Signup route
router.post("/signup", wrapAsync(listingController.Signup));

router.get("/login", listingController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),listingController.login);

// logout
router.get("/logout", listingController.logout);

module.exports = router;