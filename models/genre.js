const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  // schema.validate({ username: 'abc', birth_year: 1994 })
  return schema.validate(genre);
  // -> { value: {}, error: '"username" is required' }
}

module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
