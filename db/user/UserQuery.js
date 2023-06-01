const user = require("../../model/User")

async function createUser(_user) {
    try {
        await user.create({
            username: _user.username,
            password: _user.password,
            role: _user.role
        });
        return {body: {success: true}, statusCode: 200};
    } catch (error) {
        if (error.code === 11000) {
            return {body: {error: "User already exists. try another UserName."}, statusCode: 401, success: false}
        } else {
            console.error("UserQuery.js" + error.name + error.code + "error:", error);
            return {body: {error: error.message}, success: false, statusCode: 500};
        }
    }
}

async function updateUserRole(username, roles) {
    try {
        await user.updateOne(
            {username: username}, {$set: {role: roles}}
        );
        return {body: {success: true}, statusCode: 200};
    } catch (error) {
        if (error.code === 11000) {
            return {body: {error: "User already exists. try another UserName."}, statusCode: 401, success: false}
        } else {
            console.error("UserQuery.js" + error.name + error.code + "error:", error);
            return {body: {error: error.message}, success: false, statusCode: 500};
        }
    }
}

module.exports = {
    createUser,
    updateUserRole
}