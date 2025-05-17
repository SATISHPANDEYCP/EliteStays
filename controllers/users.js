const user = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.Signup = async (req, res, next) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
};