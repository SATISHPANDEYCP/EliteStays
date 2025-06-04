const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EliteStays";

main()
  .then(() => {
    console.log(`Connected to MongoDB: ${MONGO_URL.includes("mongodb+srv") ? "Online (Atlas)" : "Offline (Local)"}`);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
// Category options from dropdown
const categories = [
  "Trending",
  "Room",
  "Iconic Cities",
  "Mountain",
  "Castles",
  "Amazing Pools",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats"
];
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("680664c5f33aba20e452d862"),
    category: categories[Math.floor(Math.random() * categories.length)],
  }));
  await Listing.insertMany(initData.data);
  console.log("✅ Data was initialized with random categories!");
};

initDB();