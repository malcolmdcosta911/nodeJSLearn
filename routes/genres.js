const express = require("express");
const { Genre, validate } = require("../models/genre");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// const asyncMiddleware = require("../middleware/asyncMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find()
    .select("-__v") // remove  __v added by moongoose
    .sort("-name");
  res.status(200).json(genres);
});

router.post("/", auth, async (req, res) => {
  //req.body --> { name: 'action' }
  const { error } = validate({ name: req.body.name });
  if (error) return res.status(400).json(error.details[0].message);
  //need to validate moongoose too ?
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.status(200).json(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate({ name: req.body.name });
  if (error) return res.status(400).json(error.details[0].message);

  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  ).select("-__v");
  if (!genre)
    return res.status(404).json("The genre with the given ID was not found.");
  res.status(200).json(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  let { deletedCount } = await Genre.deleteOne({ _id: req.params.id }); // returns {deletedCount: 1}
  if (!deletedCount)
    return res.status(404).json("The genre with the given ID was not found.");
  res.status(200).json("delete sucess");
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("-__v");
  if (!genre)
    return res.status(404).json("The genre with the given ID was not found.");
  res.status(200).json(genre);
});

module.exports = router;

// router.get(
//     "/:id",
//     asyncMiddleware(async (req, res) => {
//         const genre = await Genre.findById(req.params.id).select("-__v");
//         if (!genre)
//             return res
//                 .status(404)
//                 .json("The genre with the given ID was not found.");
//         res.status(200).json(genre);
//     })
// );
