const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");
Joi.objectId = require("joi-objectid")(Joi);
// Joi.objectId = require("joi-objectid")(Joi);
// const {movieSchema} = require("../models/movie");
// const {customerSchema} = require("../models/customer");
// const {genreSchema} = require("../models/genre");

const rentalSchema = new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            name:{
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        isGold:{
            type: Boolean,
            default: false
        },
        phone:{
            type:String,
            required: true,
            minlength: 5,
            maxlength: 50
        }
        }),
        required: true
    },
        movie:{
            type: new mongoose.Schema({
                title:{
                    type:String,
                    required: true,
                    minlength: 5,
                    maxlength: 255
                },
                dailyRentalRate:{
                    type: Number,
                    required: true,
                    min: 0,
                    max: 255
                }
            }),
            required: true
        },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        "customer._id": customerId,
        "movie._id": movieId
    });
};

rentalSchema.methods.return = function(){  //this is for setting the returned date and calculating the rentalFee in returns.js(so we just need to call it there)
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, "days");
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId()
});


module.exports.Rental = Rental;
module.exports.schema = schema;







