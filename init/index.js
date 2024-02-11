const mongoose = require("mongoose");

const data = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then((res) => {
    console.log("Connected to DB");
}).catch((err) =>  {
    console.log(err);
});

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("Data was initialized");

};

initDB();