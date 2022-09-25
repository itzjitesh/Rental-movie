// const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {Genre, schema} = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get("/", async(req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});
//here we have not applied manually asyncMiddleware still it has been applied using express-async-errors npm package and with this npm helps we need not to change our structure of code it would be applied by itself.(Also if this npm does not work then we have to applied it as below)
// router.get("/", asyncMiddleware(async(req, res) => { 
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
// }));

router.post("/",auth, async(req, res) => {
 const {error} = schema.validate(req.body);
 if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name,
        // genre: req.body.genre
    });
    await genre.save(function(err, result){
        if(err){
            res.send(err);
        }else{
            console.log("The new genre is created!");
            res.send(result);
        }
    });
});

router.put("/:id", async(req, res) => {
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
   const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {name: req.body.name},{new: true}    
   );
   if(!genre) return res.status(404).send("The genre is not available");
   res.send(genre);
});

router.delete("/:id",[auth, admin], async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id,
        {new: true});
    if(!genre) return res.status(404).send("This document does not exits!");
    res.send(genre);
});

router.get("/:id", validateObjectId, async(req, res) =>{

    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send("Genre not found!");
    
    res.send(genre);
});

module.exports = router;