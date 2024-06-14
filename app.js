const express = require("express");
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/models.js');
let app = express();
const dayjs = require("dayjs");
const main = require('./controllers/main');
const user = require('./controllers/user');
const session = require("express-session");
const passport = require("passport");
middleware = require("./lib/middleware.js");
require("./models/db");
credentials = require("./credentials");

// set up handlebars view engine
let handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  helpers: {
    formatDate: function (date, format) {
      return dayjs(date).format(format);
    },
  },
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 3000);

//Set up sessions
app.use(require("cookie-parser")(credentials.cookieSecret));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy({usernameField: 'username'}, User.authenticate()));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
// Extra middleware
app.use(middleware.populateFormData);
app.use(middleware.flashMessages);

// TODO: Route implementations
//main routs
app.get('/', middleware.loginRequired, main.root);
app.get('/results', middleware.loginRequired, main.results);
app.post('/add/:showId', main.add);
app.delete('/remove/:showId', main.remove);

//user routes
app.get('/login', user.login.login);
app.post('/login', user.login.processLogin);
app.post('/register', user.processNewUser.processNewUser);

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
  res.status(404);
  res.render("404");
});
// 500 error handler (middleware)
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});
app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});