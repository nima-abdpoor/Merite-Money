const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const configSchema = new Schema({
    team: String,
    assignedCoins: {
        type: Number,
        value: 0,
    }
})

const Config = mongoose.model("config", configSchema)

module.exports = Config