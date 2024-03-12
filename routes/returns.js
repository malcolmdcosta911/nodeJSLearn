const express = require("express");
const { Rental, validate } = require("../models/rental");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).json("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).json("Return already processed.");

  // await rental.return();
  rental.return();
  await rental.save();

  const movie = await Movie.findOne({ _id: rental.movie._id });
  movie.$inc("numberInStock", 1);
  await movie.save();

  return res.json(rental);
});

module.exports = router;
