const mongoose = require("mongoose");

const data = require("./dataNew.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  let a = [];
  for (listing of data.data) {
    a.push({ ...listing, owner: '65ddc7a50b6d3d97aeb67c79' });
  }
  await Listing.insertMany(a);
  console.log("Data was initialized");
};

initDB();
