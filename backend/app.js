const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv").config();
require("./strategies/local-strategy.js");

const usersRouter = require("./routes/users");
const generatorRouter = require("./routes/generator");
const imagesRouter = require("./routes/images");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI);

// .then(()=>{
// })


app.use(
	session({
		secret: process.env["EXPRESS_SESSION_SECRET"],
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000 * 60,

		},
	}),
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/api/auth",
	passport.authenticate("local"),
	(req, res) => {

		// Deep copy, do not remove JSON parse and stringify!
		const userData = JSON.parse(JSON.stringify(req.user));
		delete userData.password;
		res.status(200).json(userData);
	},
);

app.get("/api/auth/status",
	(req, res) => {
		console.log(req.cookies);

		if (req.user && req.cookies["connect.sid"]) return res.status(200).send({
			username: req.user.username,
			credits: req.user.credits,
		});

		return res.sendStatus(401);
	},
);

app.post("/api/auth/logout", (req, res) => {
	if (!req.user) return res.sendStatus(401);
	req.logout((err) => {
		if (err) return res.sendStatus(400);
		res.sendStatus(200);
	});
});

/* EXAMPLE OF A PROTECTED PATH */

// app.get("/hello", checkAuthenticated, 
//   (req,res) =>{
//     if(req.user) return res.send({msg:"Im authenticated!"});

//     return res.sendStatus(401);
//   }
// )


function checkAuthenticated(req, res, next) {
	req.isAuthenticated() ? next() : res.redirect("/login");
}

app.get("/", (req, res) => {
	const { session } = res.locals;
	res.render("index", { user: session?.user });
});

// Routes
app.use("/api/users", usersRouter);
app.use("/api/generator", generatorRouter);
app.use("/api/images", imagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	// res.render('error');
	res.json({ messsage: err.message });
});

module.exports = app;
