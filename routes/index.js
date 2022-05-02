var express = require('express');
var router = express.Router();
var userModel = require("./users")
var localStratergy = require('passport-local')
var passport = require('passport');
const { session } = require('passport/lib');
passport.use(new localStratergy(userModel.authenticate()))
var expressSession = require("express-session")
const {body,validationResult } = require('express-validator')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {errors:false});
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  }),
  function(req,res){}
  );

router.get("/login", function(req,res,next){
  res.render("login")
});

router.post("/register",body("password").isLength({min:5}).withMessage("Minimum 5 Characters") ,function(req,res,next){
  errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render("index",errors)
  }
  const userDetails = new userModel({
    name : req.body.name,
    username : req.body.username,
    email : req.body.email,
  })
  userModel.register(userDetails, req.body.password).then(function (registeredUser) {
    passport.authenticate("local")(req, res, function () {
    res.redirect("/");
    });
    });
})

router.get('/profile', isLoggedIn,function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    console.log(user);
    console.log(req.body)
  res.render('profile',{user});
  })
})

router.get("/logout", function(req,res,next){
  req.logOut();
  res.render("/");
})

router.get("/timeline", function(req,res,next){
  res.render("timeline")
  
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next(); 
  }
  else{res.redirect("/login")} 
}

module.exports = router;
