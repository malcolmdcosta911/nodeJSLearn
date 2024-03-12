const logger = require("../utils/logger");

function error(err, req, res, next) {
  // console.log("err.message", err.message);
  logger.error(err.message, err);
  res.status(500).json("Something failed");
}

module.exports = error;
