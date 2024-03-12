require("dotenv").config();
console.log(process.env);
const express = require("express");
const logger = require("./utils/logger");
const app = express();
const config = require("config");

require("./startup/logging"); //currying later -------------
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

// throw new Error("something failed during startup");

// Promise.reject(new Error("unhandled rejection"));

// const port = process.env.PORT || config.get("port");

//seeing that 1. mongoDb completes reuquest but vercel no response sent   2. sending request again creates duplicate entry in mongodb

//section 12, 13 14 left
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
