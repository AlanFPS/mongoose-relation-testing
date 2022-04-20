var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", function (req, res, next) {
  res.render("create-user");
});

router.post("/sign-up", function (req, res, next) {
  // res.render('create-user');

  User.create({ username: req.body.username })
    .then((results) => {
      console.log("success", results);
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Something went wrong", err.message);
    });
});

router.get("/new-post", function (req, res, next) {
  res.render("create-post");
});

router.post("/new-post", function (req, res, next) {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    creatorId: "625edd8321e64121b31a16f0",
  })
    .then((createdPost) => {
      console.log("Post created", createdPost);
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Failed to create post", error.message);
    });
});

router.get("/all-posts", function (req, res, next) {
  Post.find()
    .populate("creatorId")
    .then((allPosts) => {
      res.render("all-posts", { allPosts: allPosts });
    })
    .catch((err) => {
      console.log("Something went wrong", err.message);
    });
});

//Get user and profile, option 1
router.get("/profile/:userId", function (req, res, next) {
  User.findById(req.params.userId)
    .then((foundUser) => {
      Post.find({ creatorId: req.params.userId }).then((allPosts) => {
        res.render("profile", { user: foundUser, allPosts: allPosts });
      });
    })
    .catch((err) => {
      console.log("Something went wrong", err.message);
    });
});

//Get user and profile, option 2
// router.get("/profile/:userId", function (req, res, next) {
//   Post.find({ creatorId: req.params.userId })
//     .populate("creatorId")
//     .then((allPosts) => {
//       res.render("profile", {
//         user: allPosts[0].creatorId,
//         allPosts: allPosts,
//       });
//     })
//     .catch((err) => {
//       console.log("Something went wrong", err.message);
//     });
// });

module.exports = router;
