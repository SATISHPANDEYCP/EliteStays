const Listing = require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");

    // If coordinate is not saved then it save the coordinates using Mapbox Geocoding API
    if (!listing.geometry || !listing.geometry.coordinates.length) {
        const geoData = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1,
        }).send();

        if (geoData.body.features.length) {
            listing.geometry = geoData.body.features[0].geometry;
            await listing.save();
        }
    }

    if (!listing) {
        req.flash("error", "Listing you requested for does not exists.");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
            .send()

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.owner = req.user._id;
        newListing.image = {
            url, filename
        };
        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New listing created successfully.");
        res.redirect("/listings");
    }
    catch (e) {
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings");
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists.");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "New listing updated successfully.");
    req.flash("error", "Something went wrong while updating the listing.");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "New listing deleted successfully.");
    req.flash("error", "Something went wrong while deleting the listing.");
    res.redirect("/listings");
};

module.exports.search = async (req, res) => {
    const { destination } = req.query;
    const filteredListings = await Listing.find({
        $or: [
            { title: { $regex: destination, $options: 'i' } },
            { location: { $regex: destination, $options: 'i' } },
            { description: { $regex: destination, $options: 'i' } },
            { country: { $regex: destination, $options: 'i' } },
            { category: { $regex: destination, $options: 'i' } }
        ]
    });
    if (filteredListings.length === 0) {
        req.flash("error", "No listings found for your search.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings: filteredListings });
};

module.exports.about = (req, res) => {
    res.render("footer/about");
};

module.exports.careers = (req, res) => {
    res.render("footer/careers");
};

module.exports.travelGuides = (req, res) => {
    res.render("footer/travelGuides");
};

module.exports.destinationInfo = (req, res) => {
    res.render("footer/destinationInfo");
};

module.exports.bookingTips = (req, res) => {
    res.render("footer/bookingTips");
};

module.exports.helpCenter = (req, res) => {
    res.render("footer/helpCenter");
};

module.exports.faqs = (req, res) => {
    res.render("footer/faqs");
};

module.exports.privacyPolicy = (req, res) => {
    res.render("footer/privacyPolicy");
};

module.exports.termsOfService = (req, res) => {
    res.render("footer/termsOfService");
};  