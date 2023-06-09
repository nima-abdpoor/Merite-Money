const bcrypt = require("bcryptjs")

async function isPasswordMatches(passwordEnteredByUser, hash) {
    return bcrypt.compare(passwordEnteredByUser, hash)
}

module.exports = isPasswordMatches
