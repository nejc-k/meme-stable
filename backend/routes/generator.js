var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Image = require("../models/Image");
const { spawn } = require("child_process");

/**
 * @description POST request to generate an image based on the prompt provided by the user. The user must be authenticated
 * 							in order to generate an image. If the user is an admin, they can generate images without any restrictions.
 *
 * @param {Request} req - Request object containing the prompt provided by the user.
 * @param {Response} res - Response object containing the generated image URL.
 * @returns {Response} - Response object containing the generated image URL.
 * */
router.post("/", async (req, res) => {
	try {
		console.log("User", req.user);
		console.log("Cookies", req.cookies);

		if (!req.user) {
			res.status(403).json({ error: "User is not authenticated" });
			return;
		}
		const prompt = req.body.prompt;

		if (req.user.isAdmin || req.user.credits > 0) {
			/*
			const generatedImage = await Image.create({
				userId: req.user.id,
				imageUrl: `images/${req.user.id}/3e92de62-47cc-43c3-a773-9816f8355989.png`,
			});
			*/

			// TODO: Enable in production (when model is trained)
			const pyProg = spawn("python3", ["python/generator.py", prompt, req.user.id]);
			let imagePathBase = `${process.env.API_BASE_URI}:${process.env.PORT}`;
			let imagePath = "";

			pyProg.stdout.on("data", (data) => {
				imagePath += data.toString().trim();
			});

			pyProg.on("close", async (code) => {
				if (code === 0 && imagePath) {
					let user = await User.findById({ _id: req.user.id });
					user.credits = user.credits + 1;
					user.save();
					await Image.create({
						userId: req.user.id,
						url: imagePath,
					});
					res.status(201).json({ imgUrl: imagePathBase + imagePath });

				} else {
					res.status(500).json({ message: "Image generation failed" });
				}
			});

			pyProg.stderr.on("data", (data) => {
				console.log(`Error: ${data}`);
				return;
			});
		} else {
			res.status(429).json({ message: "You have run out of credits for today. Check back tommorow for more!" });
			return;
		}

	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});


module.exports = router;
