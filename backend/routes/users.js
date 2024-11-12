const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * @description GET request to retrieve a specific user based on the username provided by the user.
 * 							The user must be authenticated in order to retrieve the user.
 *
 * @param {Request} req - Request object containing the username provided by the user.
 * @param {Response} res - Response object containing the user.
 * @returns {Response} - Response object containing the user.
 */
router.get("/", async function (req, res) {
	const { username } = req.params;
	const user = await User.findOne({ username: username });
	console.log(user);
	res.send(user);

});

/**
 * @description POST request to create a new user based on the information provided by the user. The user must provide
 * 							their email, username, name, lastname and password in order to create an account. The password is hashed
 * 							using bcrypt before storing it in the database.
 *
 * @param {Request} req - Request object containing the user information.
 * @param {Response} res - Response object containing the newly created user.
 * @returns {Response} - Response object containing the newly created user.
 */
router.post("/", async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (user) return res.status(400).json({ message: "User with this username already exists" });

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				throw new Error("Error with creating user");
			}
			const password = req.body.password;
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) {
					throw new Error("Error with creating user");
				}

				const user = await User.create(
					{
						email: req.body.email,
						username: req.body.username,
						name: req.body.name,
						lastname: req.body.lastname,
						password: hash,
						credits: 10,
						isAdmin: false,
					},
				);
				if (!user) throw new Error("Error creating user");
				res.status(201).json({ ...user });
			});
		});


	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
