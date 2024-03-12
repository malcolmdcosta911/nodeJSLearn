// const config = require('config');

module.exports = function () {
  // if (!config.get('jwtPrivateKey')) {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("FATAL ERROR: JWT_PRIVATE_KEY is not defined.");
  }

  if (!process.env.MONGO_URL) {
    throw new Error("FATAL ERROR: MONGO_URL is not defined.");
  }

  if (!process.env.REQUIRES_AUTH) {
    throw new Error("FATAL ERROR: REQUIRES_AUTH is not defined.");
  }
};
