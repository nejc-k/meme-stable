const mongoose = require("mongoose");

/**
 * @description Image schema for MongoDB model. Model properties are self-explanatory.
 * */
const imageSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);