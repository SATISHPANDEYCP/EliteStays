const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require('dotenv').config();
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");

const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EliteStays";
const port = 8080;

main()
  .then(() => {
    console.log(`Connected to MongoDB: ${MONGO_URL.includes("mongodb+srv") ? "Online (Atlas)" : "Offline (Local)"}`);
    console.log("Connected At:", new Date().toLocaleString());
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret: "rsndom stringskdlfjdslkfjsldk"
  }
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Define session settings
const sessionOptions = {
  store,
  secret: "rsndom string",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //This is use to set the expiry time 
    maxAge: 1000 * 60 * 60 * 24 * 7, //This is define the max age of cookie
    httpOnly: true,
  }
}

// Session use
app.use(session(sessionOptions));
app.use(flash());

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter) // Ensure 'id' is accessible in the reviews router by using { mergeParams: true }
app.use("/", UserRouter);

// This route for when not any route matched
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found."));
});

// Custom Error Handelling
app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something Went wrong." } = err;
  res.status(statuscode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`Live at: http://localhost:${port}`);
});