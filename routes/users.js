const auth = require("../middleware/auth");
const {User, schema} = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get("/me", auth, async(req, res) => {
    const users = await User.findById(req.user._id).select("-password");
    res.send(users);
});

router.get("/", async(req, res) => {
    const user = await User.find().sort("name");
    res.send(user);
});


router.post("/", async(req, res) => {

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("User already exists!");

    

    user = new User (_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

        // name: req.body.name,
        // email: req.body.email,
        // password: req.body.password
    // });
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
