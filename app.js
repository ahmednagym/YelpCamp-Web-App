var express        = require("express"),
    app            = express(),
    bodyparser     = require("body-parser"),
    flash          = require("connect-flash"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),    
    commentsRoutes   = require("./routes/comments"),    
    indexRoutes      = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://nagy:12345@ds231090.mlab.com:31090/yelpcamp-database");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB();

app.locals.moment = require('moment');

//passport configuration
app.use(require("express-session")({
    secret: "fight club",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
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
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!!");
});