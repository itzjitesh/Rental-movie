const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50        
    },
    isGold:{
        type:Boolean,
        default: false
    },
    phone:{
        type: String,
        minlength: 5,
        maxlength: 9
    }
});

const Customer = mongoose.model("Customer", customerSchema);

// function validateCustomer(customer) {
//     const schema = {
//         name: Joi.String().min(3).max(50).required()

//     };
//     return Joi.validate(customer, schema);
// }

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
// module.exports.Customer = Customer;