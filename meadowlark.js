const express = require("express");
const { engine: expressHandlebars } = require("express-handlebars");
const fortune = require("./lib/fortune");
const handlers = require("./lib/handlers");
const weatherMiddleware = require("./lib/middleware/weather");
const bodyPareser = require("body-parser");

const app = express();

// configure Handlebars view engine
app.engine(
	"handlebars",
	expressHandlebars({
		defaultLayout: "main",
		helpers: {
			section: function (name, options) {
				if (!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			},
		},
	})
);
app.set("view engine", "handlebars");

const port = process.env.PORT || 3000;

app.use(bodyPareser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use(weatherMiddleware);

app.get("/", handlers.home);
app.get("/section-test", handlers.sectionTest);

app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
	app.listen(port, () => {
		console.log(
			`Express started on http://localhost:${port}` +
				"; press Ctrl-C to terminate."
		);
	});
} else {
	module.exports = app;
}
