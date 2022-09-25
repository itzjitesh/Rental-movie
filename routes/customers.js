const {Customer} = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async(req, res) => {
    const customer = await Customer.find().sort("name");
    res.send(customer);
});

router.post("/", async(req, res) => {

// const { error } = validateCustomer(req.body);
// if(error) return res.status(400).send(error);

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    await customer.save(function(error, result){
        if(error){
            console.log("error", error);
        }else{
            console.log("The new customer is added!");
            res.send(result);
        }
    });  
});

router.put("/:id", async(req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {name: req.body.name},
        {new: true});

    if(!customer) return res.status(404).send("No customers exists!");
    res.send(customer);
});

router.delete("/:id", async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id, {new: true});

    if(!customer) return res.status(404).send("No customer exists for this!");
    res.send(customer);
});

router.get("/:id", async(req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(400).send("Invalid Customer");

    res.send(customer);
}); 

module.exports = router;