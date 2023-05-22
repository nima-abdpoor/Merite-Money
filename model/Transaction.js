const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const schema = mongoose.Schema

const transactionSchema = new Schema({
    transactionId: String,
    amount: Number,
    date: Date,
    description: String,
    fromId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    toId: {type: mongoose.Schema.Types.ObjectId, ref: "user"}
})

const Transaction = mongoose.model("transaction", transactionSchema)

module.exports = Transaction