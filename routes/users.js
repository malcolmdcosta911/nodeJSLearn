const express = require("express");
const { User, validate } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

//user profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v -password");
  res.status(200).json(user);
});

//register
router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("User already registered");

  const myPlaintextPassword = req.body.password;
  const saltRounds = 10;

  const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    // password: hash
  });
  user.password = hash;
  await user.save();
  const token = user.generateAuthToken();
  res.append("x-auth-token", token);
  res.json({ _id: user._id, email: user.email, name: user.email });

  // res.send();
  // res.status(200); //cannot use
  // res.header("x-auth-token",  user.generateAuthToken()).status(200); //cannot use
});

module.exports = router;
