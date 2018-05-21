var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.campgroundOwnership = function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
              req.flash("error", "Campground not found");
              res.redirect("back");
          } else {
              //check if the user owns this campground
              if(foundCampground.author.id.equals(req.user._id)){
                  next();
              } else {
                  req.flash("error", "Permission Denied");
                  res.redirect("back");
              }
          }
       });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
              res.redirect("/campgrounds");
          } else {
              //check if the user owns this comment
              if(foundComment.author.id.equals(req.user._id)){
                  next();
              } else {
                  req.flash("error", "Permission denied");
                  res.redirect("back");
              }
          }
       });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

//check if a user is loggedIn
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

module.exports = middlewareObj;