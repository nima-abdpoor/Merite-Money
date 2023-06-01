const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require("mongoose-auto-increment")
const schema = mongoose.Schema

const userSchema = new Schema({
    id: String,
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

userSchema.plugin(uniqueValidator)
autoIncrement.initialize(mongoose.connection)
const User = mongoose.model("user", userSchema)

module.exports = User