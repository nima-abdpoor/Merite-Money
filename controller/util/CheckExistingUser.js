const user = require("../../model/User");
const isPasswordMatches = require("./PasswordDecryption");
const {has} = require("koa/lib/response");

async function getUser(userId, password) {
    const requester = await user.find({username: userId})
    if (!"username" in requester || requester.length === 0) {
        return {body: "User Not Found", status: 404, success: false}
    }
    isPasswordMatches(password, requester[0].password, (error, isMatch) => {
        if (error) {
            return {body: "Error Accrued!" + error, status: 500, success: false}
        } else {
            if (!isMatch) {
                return {body: "Incorrect Password!", status: 401, success: false}
            }
        }
    });
    return {success: true, body: requester}
}

module.exports = getUser
