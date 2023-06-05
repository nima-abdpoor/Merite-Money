const user = require("../../model/User")

async function createUser(_user) {
    try {
        await user.create({
            username: _user.username,
            password: _user.password,
            role: _user.role,
            assignedCoins: _user.assignedCoins,
            receivedCoins: _user.receivedCoins
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

async function getUsers() {
    try {
        let query = {role: {"$in": ["User"]}}
        let result = await user.find(query, {"username":1, "_id":0})
        return {success: true, statusCode: 200, body: result}
    } catch (error) {
        console.error("UserQuery.js/ getUsers" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

module.exports = {
    createUser,
    updateUserRole,
    getUsers
}