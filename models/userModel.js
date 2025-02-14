const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isProductionHouse: {
        type: Boolean,
        default: false,
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
