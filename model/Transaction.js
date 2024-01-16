const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const schema = mongoose.Schema

const transactionSchema = new Schema({
    transactionId: String,
    amount: Number,
    date: Date,
    description: String,
    fromId: String,
    toId: Array,
    team: String
})

const Transaction = mongoose.model("transaction", transactionSchema)

module.exports = Transaction