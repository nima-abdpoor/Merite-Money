const user = require("../../model/User");
const isPasswordMatches = require("./PasswordDecryption");
const {has} = require("koa/lib/response");

async function getUser(userId, password) {
    const requester = await user.find({username: userId})
    if (!"username" in requester || requester.length === 0) {
        return {body: "User Not Found", status: 404, success: false}
    }
    let response = undefined
    let result = await isPasswordMatches(password, requester[0].password)
    if (result){
        response = {success: true, body: requester}
    }else {
        response = {body: {error: "Incorrect Password"}, status: 403, success: false}
    }
    return response
}

module.exports = getUser
