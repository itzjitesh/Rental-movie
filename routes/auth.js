const {User} = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


// router.get("/", async(req, res) => {
//     const users = await User.find().sort("name");
//     res.send(users);
// });


router.post("/", async(req, res) => {

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid user or password!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid user or password!");

    const token = user.generateAuthToken();

    res.send(token);

    

    // res.send(_.pick(user, ["_id", "name", "email"]));
});

const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
});

module.exports = router;
