const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
// const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024, // hashed and stored
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
  const token = jwt.sign(
    {
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin,
      _id: this._id,
    },
    process.env.JWT_PRIVATE_KEY
    // config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(255).required().email(), //can email to string
    password: Joi.string()
      .min(2)
      .max(255) //not hashed
      .required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
