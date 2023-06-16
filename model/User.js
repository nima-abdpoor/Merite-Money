const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcryptjs")
const schema = mongoose.Schema

const userSchema = new Schema({
    id: Number,
    username: {
        type: String,
        required: true,
        unique: true,
        select: true
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
    },
    team: String
})
userSchema.pre("save", function (next) {
    const user = this
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }

                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})
// userSchema.plugin(autoIncrement, {inc_field: 'id'});
// userSchema.plugin(uniqueValidator)
const User = mongoose.model("user", userSchema)

module.exports = User