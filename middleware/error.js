const winston = require("winston");
require("winston-mongodb");

module.exports = function(err, req, res, next){

    // winston.log(error, err.message);
    winston.error(err.message, err);

    res.status(500).send("Something is wrong!");
};

