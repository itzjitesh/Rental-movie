const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
// require("joi-oid");
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);
// require("./startup/validation")(); //



const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
    // winston.info(`Port is running at ${port}`)
    console.log(`Port is running at ${port}`)
);

module.exports = server;
