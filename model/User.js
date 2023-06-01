const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-sequence')(mongoose);
const schema = mongoose.Schema

const userSchema = new Schema({
    id: Number,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: ["User", "Admin", "SuperAdmin"],
    assignedCoins: {
        type: Number,
        value: 0,
    },
    receivedCoins: {
        type: Number,
        value: 0
    }
})
// userSchema.plugin(autoIncrement, {inc_field: 'id'});
// userSchema.plugin(uniqueValidator)
const User = mongoose.model("user", userSchema)

module.exports = User