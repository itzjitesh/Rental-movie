require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");



// process.on("uncaughtException", (ex) =>{
//     console.log("WE GOT AN UNCAUGHT EXCEPTION");
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

// process.on("unhandledRejection", (ex) =>{
    // console.log("WE GOT AN Unhandled Rejection");
    // winston.error(ex.message, ex);
    // process.exit(1);
// });

// winston can handle both the above type of error with the below line of code(any uncaught exception outside of express(which is managed by error.js(middleware error ) and also unhandled Promise rejection ))

module.exports = function(){
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({filename: "uncaughtexception.log"}));
    
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB(
        {db: "mongodb://localhost:27017/vidly",
        level: "info"
        }
    ));
};
// Remember winston works inside the area of express so anything outside of it it does not log into file.

// throw new Error("Something failed during startup."); // This is an example of uncaught exception

// const p = Promise.reject(new Error("Stop Nothing is running!")); // This is an example of unhandled rejection(as it is a Promise method)
// p.then(() => console.log("Done"));