//campgrounds routes
//INDEX show all campgrounds
var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground"); 
var middleware = require("../middleware/middleware.js");

router.get("/", function(req, res){
    // Get All Data from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
           res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});   
        }
    });
    
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new campground and save db 
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err){
            console.log("err");
        } else{
            //Redirect back to backgrounds 
            res.redirect("/campgrounds");
        }
    });
    
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one cmpground 
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            //render show template with that campground 
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.campgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground 
router.put("/:id", middleware.campgroundOwnership, function(req, res){
   //find and update campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//Destroy campground
router.delete("/:id", middleware.campgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   }); 
});

module.exports = router;