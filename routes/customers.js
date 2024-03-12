const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Customer, validate } = require("../models/customer");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().select("-__v");
  // .sort("-name");
  res.status(200).json(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.status(200).json(customer);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  ).select("-__v");
  if (!customer)
    return res
      .status(404)
      .json("The customer with the given ID was not found.");
  res.status(200).json(customer);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  let { deletedCount } = await Customer.deleteOne({ _id: req.params.id }); // returns {deletedCount: 1}
  if (!deletedCount)
    return res
      .status(404)
      .json("The customer with the given ID was not found.");
  res.status(200).json("delete sucess");
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-__v");
  if (!customer)
    return res
      .status(404)
      .json("The customer with the given ID was not found.");
  res.status(200).json(customer);
});

module.exports = router;
