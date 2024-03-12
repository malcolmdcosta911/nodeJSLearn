const mongoose = require("mongoose");
const { User } = require("../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.get("x-auth-token");
  if (!token) return res.status(401).json("Access denied. No token provided.");
  // 401 Unauthorized
  // 403 Forbidden
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded; //1. check if admin middleware -->[auth, admin] --> cause auth adds 'req.user'  2. /me api to get _id
    next();
  } catch (error) {
    res.status(400).json("Invalid token.");
  }
};
