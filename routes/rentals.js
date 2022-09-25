const {Rental, schema} = require("../models/rental");
const {Movie} = require("../models/movie");
const {Customer} = require("../models/customer");
// const {schema} = require("../models/rental");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

// Fawn.init(mongoose.connect("mongodb://localhost:27017/vidly"));

router.get("/", async(req, res) => {
    const rentals = await Rental.find().sort("name");
    res.send(rentals);
});

router.put("/:id", async(req, res) => {

const {error} = schema.validate(req.body);
if(error) return res.status(400).send(error.details[0].message);

const customer = await Customer.findById(req.body.customerId);
if(!customer) return res.status(400).send("Invalid Customer");

const movie = await Movie.findById(req.body.movieId);
if(!movie) return res.status(400).send("Invalid movie");

    const rental = await Rental.findByIdAndUpdate(req.params.id,
        {movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }},
        {new: true});
              
    if(!rental) return res.status(404).send("This entry does not exists!");
    res.send(rental);
});

router.post("/", async(req, res) => {

const {error} = schema.validate(req.body);
if (error) return res.status(400).send(error.details[0].message);

const customer = await Customer.findById(req.body.customerId);
if(!customer) return res.status(400).send("Invalid Customer");

const movie = await Movie.findById(req.body.movieId);
if(!movie) return res.status(400).send("Invalid movie");

if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock");

    let rental = await new Rental({

        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });  

    rental = await rental.save();
    
    movie.numberInStock--;
    movie.save();

    res.send(rental);

    //There is chance that in the above two operations one of them is executed and one does not in case of network or any error, so we are going to use fawn npm and with this either both will be executed or terminated(i.e both would run or cancelled simantaneously).Fawn is not working properly with the below code so we are going to apply the above code for now but remember that it has to be applied for executing both operations simantaneously-

    // try {
    //     new Fawn.Task()
    //         .save("rentals", rental)
    //         .update("movies", {_id: movie._id}, {
    //         $inc: {numberInStock: -1}
    //     })
    //     .run();

    // res.send(rental);
    // }
    // catch(ex) {
    //     res.status(500).send("Internal Server Error!");
    // }
});

router.delete("/:id", async(req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id,
        {new: true});

    if(!rental) return res.status(400).send("Invalid request!");

    res.send(rental);
});

router.get("/:id", async(req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(400).send("The rental with given details cannot be accessed!")

    res.send(rental);
});


module.exports = router;