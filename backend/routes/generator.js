var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Image = require("../models/Image");
const { spawn } = require("child_process");


router.post("/", async (req, res, next) => {
	try {
		console.log("User", req.user);
		console.log("Cookies", req.cookies);

		if (!req.user) {
			res.status(403).json({ error: "User is not authenticated" });
			return;
		}
		const prompt = req.body.prompt;

		if (req.user.isAdmin || req.user.credits > 0) {
			const image = await Image.find({ userId: req.user.id });
			if (image && image.length > 0) {
				return res.status(201).json({ imgUrl: image.imageUrl });
			}

			const generatedImage = await Image.create({
				userId: req.user.id,
				imageUrl: `images/${req.user.id}/3e92de62-47cc-43c3-a773-9816f8355989.png`,
			});
			return res.status(201).json({ imgUrl: generatedImage.imageUrl });

			// TODO: Enable in production (when model is trained)
			const pyProg = spawn("python3", ["python/generator.py", prompt]);
			let imagePath = `${process.env.API_BASE_URI}:${process.env.PORT}/`;

			pyProg.stdout.on("data", (data) => {
				imagePath += data.toString().trim();
			});

			pyProg.on("close", async (code) => {
				if (code === 0 && imagePath) {
					let user = await User.findById({ _id: req.user.id });
					user.credits = user.credits - 1;
					user.save();
					res.status(201).json({ imgUrl: imagePath });

				} else {
					res.status(500).json({ message: "Image generation failed" });
				}

			});

			pyProg.stderr.on("data", (data) => {
				console.error(`Error: ${data}`);
				res.status(500).json({ message: error.message });
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