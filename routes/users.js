var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/signup", function (req, res, next) {
  //1. Make sure the fields are filled out
  if (!req.body.username || !req.body.password) {
    res.render("create-user", { message: "Username and password required" });
  }
  //2. make sure the username/email is not already taken
  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      console.log("Found user", foundUser);
      if (foundUser) {
        //This means the user exists
        res.render("create-user", { message: "Username is taken" });
      } else {
        //3. Hash the password
        const salt = bcrypt.genSaltSync(saltRounds); //10
        console.log("SALT", salt);

        const hashedPass = bcrypt.hashSync(req.body.password, salt);
        console.log("hashedPass", hashedPass);

        //4. Create the User
        User.create({
          username: req.body.username,
          password: hashedPass,
        })
          .then((createdUser) => {
            res.json(createdUser);
          })
          .catch((err) => {
            console.log("Error creating user".err.message);
          });
      }
    })
    .catch((err) => {
      console.log("Failure checking for user", err.message);
    });
});

router.post("/login", (req, res) => {
  //1. make sure all fields are valid
  if (!req.body.username || !req.body.password) {
    res.render("login", { message: "Username and password required" });
  }
  //2. Make sure User exists
  User.findOne({ username: req.body.username })
    .then((foundUser) => {
      if (!foundUser) {
        res.render("login", { message: "Username not found" });
      } else {
        //3. make sure password is correct
        let correctPassword = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );
        if (correctPassword) {
          //4. Initilize Session
          req.session.user = foundUser;
          res.render("index", {
            title: "Express",
            confimation: `Welcome back, ${foundUser.username}`,
          });
        } else {
          res.render("login", { message: "Incorrect password" });
        }
      }
    })
    .catch((error) => {
      console.log("Login failed", error.message);
    });
});

router.get("/test-login", (req, res) => {
  if (req.session.user) {
    res.render("index", {
      title: "Express",
      confimation: "You are logged in!",
    });
  } else {
    res.render("index", {
      title: "Express",
      message: "You are not logged in",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("index", {
    title: "Express",
    confimation: "You have logged out",
  });
});

module.exports = router;
