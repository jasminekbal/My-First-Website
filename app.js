var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require ("method-override")
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User      = require("./models/user.js");
var seedDB = require("./seeds.js");

//requring routes
var commentRoutes    = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes      = require("./routes/index.js");

//seedDB();

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelpCamp", { useNewUrlParser: true });
				 
app.use(bodyParser.urlencoded ({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//app.set("view engine", ejs);


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
}); 
