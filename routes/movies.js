const express = require("express");
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");
// const moment = require('momnet'); // require
const router = express.Router();

router.get("/", async (req, res) => {
  // throw new Error("no Movies");
  const movies = await Movie.find()
    .select("-__v") // remove  __v added by moongoose
    .sort("-title");
  res.status(200).json(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).json("Invalid genre");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    }, //do note
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    // publishDate: moment().toJSON() //do note
  });
  movie = await movie.save();
  res.status(200).json(movie);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId).select("-__v");
  if (!genre) return res.status(400).json("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).json("The movie with the given ID was not found.");
  res.status(200).json(movie);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  let { deletedCount } = await Movie.deleteOne({ _id: req.params.id }); // returns {deletedCount: 1}
  if (!deletedCount)
    return res.status(404).json("The movie with the given ID was not found.");
  res.status(200).json("delete sucess");
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id).select("-__v");
  if (!movie)
    return res.status(404).json("The movie with the given ID was not found.");
  res.status(200).json(movie);
});

module.exports = router;
