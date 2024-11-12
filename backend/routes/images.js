var express = require("express");
var router = express.Router();
const path = require("path");
const Image = require("../models/Image");


/**
 * */
router.get("/", async function (req, res) {
	try {
		if (!req.user || !req.user._id) {
			res.status(403).json({ error: "User is not authenticated" });
			return;
		}

		const images = await Image.find({ userId: req.user._id });
		return res.status(200).json(images);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: "Internal server error" });
	}
});

/**
 * */
router.get("/:id", async function (req, res, next) {
	try {
		const imageName = req.params.id;
		const imagePath = path.join(__dirname + "/../", "images/", req.user.id, "/", imageName, ".png");
		res.sendFile(imagePath);

	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: "Internal server error" });
	}
});

/**
 * */
router.post(":/id", async function (req, res) {
});

module.exports = router;
