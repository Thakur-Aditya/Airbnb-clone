const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: {
        type : String,
        required: true
    
    },
    description: String,
    image : {
        type : String,
        default:"https://unsplash.com/photos/a-lake-surrounded-by-mountains-ZtWnW4rcNJ4",
        set: (v) => v===""? "https://unsplash.com/photos/a-lake-surrounded-by-mountains-ZtWnW4rcNJ4":v
    
    },
    price: Number,
    location: String,
    country: String,

});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;