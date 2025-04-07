const express = require("express");
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();

// route for signup page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new user({ email, username });
        await user.register(newUser, password);
        req.flash("success", "Welcome to the app!");
        res.redirect("/listings");
    } catch (e) {
        console.log("Signup error:", e.message); // ⬅️ Add this
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
req.flash("success","Welcome back!");
res.redirect("/listings");
});

module.exports = router;