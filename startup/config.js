const config = require("config");


module.exports = function(){
    if(!config.get("jwtPrivateKey")){
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined."); //If this error comes in the terminal use "export vidly_jwtPrivateKey=jwtPrivateKey" this line of code in terminal
    };
};

// we need to put this inside the module if we have used console.log() method but as we have used throw new Error approach which is better practice as it through stack trace so that we can know about the error.
// process.exit(1); //process.exit(0) means process is running and anything except this means not running.