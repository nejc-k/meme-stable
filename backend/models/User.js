const mongoose = require("mongoose");

/**
 * @description User schema for MongoDB model. Model properties are self-explanatory. Credits should be restored every
 * 							day to default value, which is set to 10.
 * */
const userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	name: String,
	lastname: String,
	credits: Number,
	isAdmin: Boolean,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);