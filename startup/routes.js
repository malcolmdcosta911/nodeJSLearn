const error = require("../middleware/error");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const users = require("../routes/users");
const auth = require("../routes/auth");
const customers = require("../routes/customers");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/users", users);
  app.use("/api/customers", customers);
  app.use("/api/auth", auth);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use(error);
};
