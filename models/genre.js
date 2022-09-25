const Joi = require("joi");
const mongoose = require("mongoose");


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }
    // genre:{
    //     type: String,
    //     required: true,
    //     minlength: 3,
    //     maxlength: 50
    // }
});

const Genre = mongoose.model("Genre", genreSchema);



const schema =Joi.object({
    name: Joi.string().required().min(5).max(50)
});



    // return Joi.validate(genre, schema);


module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
// modeule.exports.validate = validate;
module.exports.schema = schema;