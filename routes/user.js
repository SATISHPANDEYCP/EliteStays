const express = require("express");
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware");

// route for signup page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup route
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new user({ email, username });
        const registerUser = await user.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                console.log("Login error:", err);
                return next(err);
            }
            req.flash("success", "Welcome to the app!");
            res.redirect("/listings");
        });
    } catch (e) {
        console.log("Signup error:", e.message);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
});

module.exports = router;