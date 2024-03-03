const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
  email: { required: true, type: String },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);