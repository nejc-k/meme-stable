const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("../models/User");

/*se kliče ob prijavi*/
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);

		if (!user) throw new Error("User not found");
		done(null, user);

	} catch (err) {
		done(err, null);
	}

});

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