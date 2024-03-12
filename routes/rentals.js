const express = require("express");
const { Rental, validate } = require("../models/rental");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().select("-dateOut").select("-__v");
  res.status(200).json(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).json("The movie with the given ID was not found.");

  if (!movie.numberInStock)
    return res.status(400).json("The movie is out of stock");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .json("The customer with the given ID was not found.");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  //needs two-phase commit ...had used fawn
  await rental.save();
  movie.numberInStock--;
  movie.save();
  res.json(rental);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    // .select("-dateOut")
    .select("-__v");
  if (!rental)
    return res.status(404).json("The rental with the given ID was not found.");
  res.status(200).json(rental);
});

module.exports = router;
