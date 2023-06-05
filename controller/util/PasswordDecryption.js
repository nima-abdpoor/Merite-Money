const bcrypt = require("bcryptjs")

function isPasswordMatches(passwordEnteredByUser, hash, callback) {
    bcrypt.compare(passwordEnteredByUser, hash, (error, isMatch) => {
        if (error) {
            console.log("PasswordDecryption: " + error);
            callback(error, null);
        } else {
            callback(null, isMatch);
        }
    });
}

module .exports = isPasswordMatches
