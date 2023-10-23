const user = require("../../model/User")

async function createUser(_user) {
    try {
        await user.create({
            username: _user.username,
            password: _user.password,
            role: _user.role,
            assignedCoins: _user.assignedCoins,
            receivedCoins: _user.receivedCoins,
            team: _user.team
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

async function updateUserAssignedCoins(username, assignedCoins) {
    try {
        await user.updateOne(
            {username: username}, {$inc: {assignedCoins: assignedCoins}}
        );
        return {success: true, statusCode: 200};
    } catch (error) {
        console.error("UserQuery.js/updateUserAssignedCoins: " + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

async function updateAllUsersAssignedCoins(team, assignedCoins) {
    try {
        await user.updateMany(
            {team: team}, {$set: {assignedCoins: assignedCoins, receivedCoins: 0}}
        );
        return {success: true, statusCode: 200, body: {"message": "successfully done!"}};
    } catch (error) {
        console.error("UserQuery.js/updateAllUsersAssignedCoins: " + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

async function updateUserReceivedCoins(username, receivedCoins) {
    try {
        await user.updateOne(
            {username: username}, {$inc: {receivedCoins: receivedCoins}}
        );
        return {success: true, statusCode: 200};
    } catch (error) {
        if (error.code === 11000) {
            return {body: {error: "User already exists. try another UserName."}, statusCode: 401, success: false}
        } else {
            console.error("UserQuery.js/updateUserReceivedCoins: " + error.name + error.code + "error:", error);
            return {body: {error: error.message}, success: false, statusCode: 500};
        }
    }
}

async function getUsers(team) {
    try {
        let query = {role: {"$in": ["User"]}, team: team}
        let result = await user.find(query, {"username": 1, "_id": 0})
        return {success: true, statusCode: 200, body: result}
    } catch (error) {
        console.error("UserQuery.js/ getUsers" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

async function getUsersByReceivedCoins() {
    try {
        let query = {role: {"$in": ["User"]}}
        let result = await user.find(query, {"username": 1, "receivedCoins": 1, "_id": 0}).sort({"receivedCoins": -1}).limit(3)
        return {success: true, statusCode: 200, body: result}
    } catch (error) {
        console.error("UserQuery.js/ getUsersByReceivedCoins:" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

module.exports = {
    createUser,
    updateUserRole,
    getUsers,
    updateUserReceivedCoins,
    updateUserAssignedCoins,
    updateAllUsersAssignedCoins,
    getUsersByReceivedCoins
}