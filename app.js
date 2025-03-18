const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require('dotenv').config();
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

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

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", wrapAsync(async (req, res) => {
  let result=listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400,result.error);
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listings.");
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// This route for when not any route matched
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found."));
});

// Custom Error Handelling
app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something Went wrong." } = err;
  res.status(statuscode).render("error.ejs", { message });
  // res.status(statuscode).send(message); 
});

app.listen(port, () => {
  console.log(`Live at: http://localhost:${port}`);
});