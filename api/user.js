const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

//Mongoose user model
const user = require("../models/user.mongo");

router.post("/signup", (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name === "" || name === undefined) {
    res.status(404).send({
      error: "Enter Name!!!",
    });
  } else if (email === "" || email === undefined) {
    res.status(404).send({
      error: "Enter Email!!!",
    });
  } else if (password === "" || password === undefined) {
    res.status(404).send({
      error: "Enter password!!!",
    });
  } else if (dateOfBirth === "" || dateOfBirth === undefined) {
    res.status(404).send({
      error: "Enter Date Of Birth!!!",
    });
  } else if (!/^[ a-z A-Z ]*$/.test(name)) {
    res.status(400).send({
      error: "Invalid Name!!",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.status(400).send({
      error: "Invalid Email!!",
    });
  } else if (!new Date(dateOfBirth).getTime()) {
    res.status(400).send({
      error: "Invalid Date",
    });
  } else if (password.length < 8) {
    res.status(400).send({
      error: "Password length is short",
    });
  }

  //Checking if user already exists
  else {
    user
      .find({ email })
      .then((result) => {
        if (result.length) {
          res.status(400).send({
            Error: " User already Exists",
          });
        } else {
          //creating a new user
          //password handling
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new user({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
              });
              newUser
                .save()
                .then((result) => {
                  res.status(200).send({
                    Message: "SignUp successfull",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.status(400).send({
                    Error: "SOme error occurred during saving user",
                  });
                });
            })
            .catch((err) => {
              res.status(400).send({
                Error: "An error occurred while hashing password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          error: " An error occured while checking",
        });
      });
  }
});

router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email === "" || email === undefined) {
    res.status(404).send({
      error: "Enter Email!!!",
    });
  } else if (password === "" || password === undefined) {
    res.status(404).send({
      error: "Enter password!!!",
    });
  } else {
    //check if user exists
    user
      .find({ email })
      .then((data) => {
        if (data.length) {
          //user exists
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                res.status(200).send({
                  Message: "SignIn Successfull",
                  data: data,
                });
              } else {
                res.status(400).send({
                  Error: "Invalid pasword Entered",
                });
              }
            })
            .catch((err) => {
              res.status(400).send({
                Error: "An error occurred during comapring passwords",
              });
            });
        } else {
          res.status(400).send({
            Error: "Invalid Credentials entered",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          Error: "An error occurred while checking for existing user",
        });
      });
  }
});

module.exports = router;
