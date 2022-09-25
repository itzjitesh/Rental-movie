const mongoose = require("mongoose");
const {genreSchema} = require("./genre");


const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        min:1,
        max: 255,
        required: true
    },
    dailyRentalRate:{
        type: Number,
        min:1,
        max: 255,
        required: true
        }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;