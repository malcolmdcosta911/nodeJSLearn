const mongoose = require("mongoose");
const config = require("config");
const logger = require("../utils/logger");

module.exports = function() {
  const db = process.env.MONGO_URL;
  // const db =config.get('db') ;
  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`));
}


// main().then(() => logger.info(`Connected to ${db}...`));
// .then((res) => console.log("connected mongoDb"))
// .catch((err) => console.log(err));

// async function main() {
//   const db = config.get("db");
//   await mongoose.connect(db);
//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }


