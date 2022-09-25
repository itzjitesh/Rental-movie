const {Movie} = require("../models/movie");
const {Genre} = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async(req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.post("/", async(req, res) => {

const genre = await Genre.findById(req.body.genreId);
if(!genre) return res.status(400).send(error.details[0].message);

    const movie = await new Movie({
        title: req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie.save(function(err, result){
        if(err){
            console.log(err);
        }else{
            console.log("The new movie is added!");
            res.send(result);
        }
    });
});

router.put("/:id", async(req, res) => {

const genre = await Genre.findById(req.body.genreId);
if(!genre) return res.status(400).send("Invalid genre");

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate      
        },
        {new: true}
        );
    
    if(!movie) return res.status(404).send("No movie is available of this id!");

    res.send(movie);
});

router.delete("/:id", async(req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id,
        {new: true});
    res.send(movie);
});

router.get("/:id", async(req, res) => {
    const movie = await Movie.findById(req.params.id);
    
    if(!movie) return res.status(404).send("The movie is not found!");
    res.send(movie);
});

module.exports = router;