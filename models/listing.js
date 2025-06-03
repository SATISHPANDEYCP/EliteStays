const mongoose = require("mongoose");
const Review = require("./review");
const { string, number, required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  location: {
    type: String,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    enum: [
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
    ],
    required: true
  }

});

// Middleware for delete reviews related to listing when a listing deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
