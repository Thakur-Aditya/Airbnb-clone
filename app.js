const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');

const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views") );
app.use(methodOverride('_method'));
app.set("view engine" , "ejs");
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then((res) => {
    console.log("Connected to DB");
}).catch((err) =>  {
    console.log(err);
});



app.get("/", (req,res) => {
    res.send("Working");
});

// app.get("/testListing", (req,res) => {
//     let sampleListing = new listing({
//         title:"my new villa",
//         description:"This Villa is not mine",
//         price: 1200,
//         location:"God",
//         country:"india"
//     });

//     sampleListing.save();
//     console.log("Sample was saved");
//     res.send("checking Success");
// });

app.get("/listings", async (req,res) => {
   allListings = await Listing.find({});
   res.render("./listing/index.ejs" ,{allListings});
});

app.put("/listing/:id" , async (req,res) => {
    let {id} = req.params;
    let data = req.body;
    let newListing = new Listing(data);
    // console.log(req.body);
    await Listing.findByIdAndUpdate(id,{...data});
    // newListing.save().then((res) => {
    //     console.log("edited new LIsting");
    // }).catch((err) => {
    //     console.log(err);
    // });

    res.redirect(`/listings/${id}`);

});


app.get("/listings/new", (req,res) => {
    res.render("./listing/new.ejs");
    
});



app.post("/listing", async (req,res) => {
    let data = req.body;
    let newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
});
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/show.ejs" , {listing});
 });

 app.delete("/listing/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findOneAndDelete({_id:id});
    res.redirect("/listings");
 });

 app.get("/listing/:id/edit" , async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {listing});
 });



app.listen(3000,(res) => {
    console.log("listening");
});








