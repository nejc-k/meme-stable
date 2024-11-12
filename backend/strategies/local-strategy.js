const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("../models/User");

/**
 * @description Serializes and deserializes the user object.
 * @param {User} user - User object to serialize.
 * @param {Function} done - Callback function.
 * @returns {Function} - Callback function.
 * */
passport.serializeUser((user, done) => {
	done(null, user.id);
});

/**
 * @description Deserializes the user object.
 * @param {String} id - User ID to deserialize.
 * @param {Function} done - Callback function.
 * @returns {Function} - Callback function.
 * */
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);

		if (!user) throw new Error("User not found");
		done(null, user);

	} catch (err) {
		done(err, null);
	}

});

/**
 * @description Local strategy for authenticating users.
 * */
passport.use(
	// validira user
	new passportLocal.Strategy(async (username, passwordAttempt, done) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) throw new Error("User not found");
			bcrypt.compare(passwordAttempt, user.password, (err, res) => {
				if (err) {
					console.error("Error comparing passwords", err);
					throw newError("Error comparing passwords");
				}
				if (res) {
					//match
					done(null, user);
				} else {
					console.log("Passwords dont match");
					throw newError("Invalid credentials");
				}
			});

		} catch (e) {
			done(e, null);
		}
	}),
);