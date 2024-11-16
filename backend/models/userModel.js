
const mongoose = require('mongoose')

//Before creating a model, we always create a Schema
const userSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    email: { type: String, required: true, minlength: 3, unique: true },
    password: { type: String, required: true, minlength: 8 },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;