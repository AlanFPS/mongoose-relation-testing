var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res, next) {
  console.log("hit", req.body);
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

module.exports = router;
