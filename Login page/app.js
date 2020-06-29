
//all the modules added to the code
require('dotenv').config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
//requiring the express module
const app = express();

//allowing to read the body parser and the ejs files
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

//creating session to let the password
app.use(session({
    secret: "Our little secret.", 
    resave: false,
    saveUninitialized: false
}));

//initializing the code to create cookies in the webpage
app.use(passport.initialize());
app.use(passport.session());

//allowing to access the database to the user page 
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true,  useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

//creating the schema model of storing the data in the database
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

//allowing to create a new schema to cookie in the login session
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//defining the model to take the user id and login using the credentials
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//implementing the google login and also giving the oath token to login to the site
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets", 
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
 
//deciding the routes and defining the pages to render while the buttons are clicked
app.get("/", function(req,res){
    res.render("home")
});

app.get("/auth/google", 
   passport.authenticate("google", { scope: ["profile"] }) 
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login "}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

app.get("/login", function(req,res){
    res.render("login")
});

app.get("/register", function(req,res){
    res.render("register")
});

//rendering the code to take into the secrets and populate the secrets in order to all the logins 

app.get("/secrets", function(req,res){
    User.find({"secret": {$ne: null}}, function(err, foundUsers){
        if (err){
            console.log(err);
            
        }else{
            if(foundUsers){
                res.render("secrets", {usersWithSecrets: foundUsers});
            }
        }
    });
    // if (req.isAuthenticated()){
    //     res.render("secrets");
    // }else{
    //     res.redirect("/login")
    // }
});

app.get("/submit",  function(req,res){
    if (req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login")
    }  
})

//submitting the post request and displaying it dynamically to the page of secrets and all the users
app.post("/submit" , function(req, res){
    const submittedSecret = req.body.secret;

    console.log(req.user.id);

    User.findById(req.user.id, function(err, foundUser){
        if(err){
            console.log(err);
            
        }else {
            if (foundUser){
                foundUser.secret= submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets")
                });
            }
        }
    });
    
});

//redirect to logout of the page and directly still login into the website using the google auth api

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

app.post("/register", function(req,res){
User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err){
        console.log(err);
         res.redirect("/register");     
    }else{
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secrets");
        });
    }
});


// bcrypt.hash(req.body.password, saltRounds, function(err,hash){
//     const newUser = new User({
//         email: req.body.username ,
//         password: hash
//     });

//     newUser.save(function(err){
//         if (err){
//             console.log(err);
//         }else{
//             res.render("secrets");
//         }
//     });
// });

});

//auth the code login using localhost api
app.post("/login", function(req,res){

        const user = new User({
            username: req.body.username,
            password: req.body.password
        });


        req.login(user, function(err){
            if (err){
            console.log(err);
            
            }else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secrets");
                });
            }
        });

    // const username = req.body.username;
    // const password = req.body.password;

    // User.findOne({email: username}, function(err, foundUser){
    //     if (err){
    //         console.log(err);
            
    //     }else {
    //         if (foundUser) {
    //             bcrypt.compare(password, foundUser.password, function(err,result){
    //              if (result === true){
    //                 res.render("secrets");
    //              }  
    //             });
                
    //         }
    //     }
    // });
});

//localhost where the page is to be populated.

app.listen(3000, function () {
    console.log("Server has started on port 3000");
});