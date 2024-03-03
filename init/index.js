const mongoose = require("mongoose");

const data = require("./dataNew.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://adityasinghpost:GoVSmBOM0dHohdVt@cluster0.vaqckqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    a.push({ ...listing, owner: '65e32723b7f40698b6b37435' });
  }
  await Listing.insertMany(a);
  console.log("Data was initialized");
};

initDB();
