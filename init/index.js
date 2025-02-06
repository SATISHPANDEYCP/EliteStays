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

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
