require('dotenv').config()
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

const port = process.env.PORT || config.get("port");
app.listen(port, () => logger.info(`Listening on port ${port}...`));
