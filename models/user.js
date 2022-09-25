const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email:{
        type: String,
        minlength: 5,
        maxlength: 255,        
        required: true,
        unique: true,
    },
    password:{
        type: String,
        minlength: 5,
        maxlength: 1024,       
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){ //here we can not use arrow function as it does not support this method
 const token = jwt.sign({_id: this._id, isAdmin:this.isAdmin}, config.get("jwtPrivateKey")); 
 return token;
};

const User = mongoose.model("User", userSchema);

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
});

exports.schema = schema;
exports.User = User;