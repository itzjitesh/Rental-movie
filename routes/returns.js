const Joi = require("joi");
const {Rental} = require("../models/rental");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();

const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId()
});


router.post("/", [auth, validate(schema)], async(req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send("rental is not found");
    if(rental.dateReturned) return res.status(400).send("Rental is already processed.");

    rental.return();
    await rental.save();

    await Movie.updateOne(
        {_id: rental.movie._id},
        {$inc: {numberInStock: 1}
    });

    return res.send(rental);
});


module.exports = router;