const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//login
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json("Invalid email or password.");

  const myPlaintextPassword = req.body.password;
  const hash = user.password;
  const validPassword = bcrypt.compareSync(myPlaintextPassword, hash);

  if (!validPassword) return res.status(404).json("Invalid email or password.");
  const token = user.generateAuthToken();
  res.status(200).send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).required().email(), //can email to string
    password: Joi.string()
      .min(2)
      .max(255) //not hashed
      .required(),
  });

  return schema.validate(user);
}

module.exports = router;
