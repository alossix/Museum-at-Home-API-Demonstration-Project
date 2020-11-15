const express = require("express");
const router = express.Router();
const PORT = process.env.PORT;
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mongoose = require("mongoose");
const session = require("express-session");

router.get("/", (req, res) => {
  res.render("index", {
    userInSession: req.session.user,
  });
});

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res) => {
  const {
    username,
    email,
    firstName,
    lastName,
    favArtist,
    password,
  } = req.body;
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      User.create({
        username,
        email,
        firstName,
        lastName,
        favArtist,
        passwordHash: hashedPassword,
      })
        .then((user) => {
          req.session.user = user;
          console.log(`user is ${user}`);
          res.redirect("/user-profile");
        })
        .catch((err) => {
          res.render("signup", {
            errorMessage: "The username or email address is already in use.",
          });
        });
    })
    .catch((err) => console.error(err));
});

router.get("/user-profile", (req, res) => {
  if (req.session.user) {
    res.render("user-profile", { userInSession: req.session.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login", {
          errorMessage: `Username not found. Please try again.`,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password.",
        });
      }
    })
    .catch((err) => console.error(err));
});

module.exports = router;
