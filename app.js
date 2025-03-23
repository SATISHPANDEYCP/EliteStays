const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require('dotenv').config();
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews) // Ensure 'id' is accessible in the reviews router by using { mergeParams: true }

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