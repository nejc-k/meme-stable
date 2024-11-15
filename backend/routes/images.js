var express = require("express");
var router = express.Router();
const path = require("path");
const Image = require("../models/Image");


/**
 * @description GET request to retrieve all images generated by the user. The user must be authenticated in order to
 * 							retrieve their images.
 *
 * @param {Request} req - Request object containing the user ID.
 * @param {Response} res - Response object containing the images generated by the user.
 * @returns {Response} - Response object containing the images generated by the user.
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
 * @description GET request to retrieve a specific image generated by the user. The user must be authenticated in order to
 * 							retrieve their images. Provides additional security by ensuring that the user can only access their own
 * 							images in contrast to plain GET request through the source attribute.
 *
 * @param {Request} req - Request object containing the user ID and the image ID.
 * @param {Response} res - Response object containing the image generated by the user.
 * @returns {Response} - Response object containing the image generated by the user.
 * */
router.get("/:id", async function (req, res) {
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
 * @description POST request to save an edited image. The user must be authenticated in order to save an edited image.
 * 							This is meant to be used if user wants to either store the image for longer period of time or if they
 * 							don't want to download the image right away.
 *
 * @param {Request} req - Request object containing the user ID and the image ID.
 * @param {Response} res - Response object containing the image generated by the user.
 * @returns {Response} - Response object containing the image generated by the user.
 * */
router.post(":/id", async function (req, res) {
});

module.exports = router;
