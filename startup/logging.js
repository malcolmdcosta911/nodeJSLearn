const logger = require("../utils/logger");
require("express-async-errors");

process.on("uncaughtException", (err) => {
  logger.error(err.message, err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(promise);
  process.exit(1);
});
