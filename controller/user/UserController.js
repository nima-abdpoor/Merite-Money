const user = require("../../model/User")
const {createUser, updateUserRole, getUsers, updateAllUsersAssignedCoins, getUsersByReceivedCoins} = require("../../db/user/UserQuery")
const isPasswordMatches = require("../util/PasswordDecryption")
const {getConfig} = require("../../db/config/ConfigQuery");
const getUser = require("../util/CheckExistingUser");
const jwt = require("jsonwebtoken");

async function PostUser(router) {
    router.post("/:userId/user", async (context, next) => {
        try {
            const requester = await user.find({username: context.params.userId})
            if (!"username" in requester) {
                context.body = "User Not Found"
                return context.status = 404
            }
            await isPasswordMatches(context.request.body.password, requester[0].password, (error, isMatch) => {
                if (error) {
                    context.body = "Error Accrued!" + error
                    return context.status = 500
                } else {
                    if (!isMatch) {
                        context.body = {error: "Incorrect Password!"}
                        return context.status = 401
                    }
                }
            });
            if (context.request.body.user.username === undefined ||
                context.request.body.user.password === undefined ||
                context.request.body.user.role === undefined ||
                context.request.body.user.team === undefined
            ) {
                context.body = {error: "define username, password, roles and team"}
                return context.status = 401
            }
            let team = context.request.body.user.team
            if (!(team === "kilid" || team === "second")) {
                context.body = {error: "team should be defined correctly. we only have \'kilid\' and \'second\' teams currently"}
                return context.status = 401
            }
            let _role = context.request.body.user.role
            const _user = await user.find({username: context.request.body.user.username})
            if (!_user[0] || !"username" in _user) {
                // user in body is not in database
                if (requester[0].role.includes("SuperAdmin")) {
                    if (_role === "SuperAdmin") {
                        context.body = "Not Allowed"
                        return context.status = 403
                    } else {
                        if (_role === "Admin" || _role === "User") {
                            let team = context.request.body.user.team
                            let config = await getAssignedCoinsFromConfig(team)
                            let creationUserResult = await createUser({
                                username: context.request.body.user.username,
                                password: context.request.body.user.password,
                                role: [_role],
                                assignedCoins: config.body[0].assignedCoins,
                                team: team,
                                receivedCoins: 0
                            })
                            context.body = creationUserResult.body
                            return context.status = creationUserResult.statusCode
                        } else {
                            context.body = {error: "Role Is Not Valid"}
                            return context.status = 401
                        }
                    }
                }
                if (requester[0].role.includes("Admin")) {
                    if (_role === "User") {
                        let team = context.request.body.user.team
                        let config = await getAssignedCoinsFromConfig(team)
                        let creationUserResult = await createUser({
                            username: context.request.body.user.username,
                            password: context.request.body.user.password,
                            role: [_role],
                            assignedCoins: config.body[0].assignedCoins,
                            team: team,
                            receivedCoins: 0
                        })
                        context.body = creationUserResult.body
                        context.status = creationUserResult.statusCode
                    }
                } else {
                    context.body = {error: "Not Allowed."}
                    return context.status = 403
                }
            } else {
                // we have already the user in our database
                if (!_user[0].role.includes("Admin") || !_user[0].role.includes("User")) {
                    if (((_role === "User" || _role === "Admin") && requester[0].role.includes("SuperAdmin")) ||
                        ((_role === "User") && requester[0].role.includes("Admin"))) {
                        if (!_user[0].role.includes(_role)) {
                            let roles = _user[0].role
                            roles.push(_role)
                            let updateUserResult = await updateUserRole(context.request.body.user.username, roles)
                            context.body = updateUserResult.body
                            context.status = updateUserResult.statusCode
                        } else {
                            context.body = {error: "User Already Has This Role!"}
                            context.status = 401
                        }
                    } else {
                        context.body = {error: "Not Allowed."}
                        return context.status = 403
                    }
                } else {
                    context.body = {error: "Not Allowed."}
                    return context.status = 403
                }
            }
        } catch (error) {
            console.log("Error In UserController:", error)
            context.status = 500
            context.body = error
        }
    })
}

async function UpdateAllUsersAssignedCoin(router) {
    router.post("/backEnd/:userId/updateAssignedCoin", async (context, next) => {
        try {
            let requester = await getUser(context.params.userId, context.request.body.password).then()
            if (!requester.success) {
                context.body = requester.body
                return context.status = requester.status
            }
            if (requester.body[0].role.includes("SuperAdmin") || requester.body[0].role.includes("Admin")) {
                if (context.request.body.coin === undefined ||
                    context.request.body.team === undefined
                ) {
                    context.body = {error: "define coin and team"}
                    return context.status = 401
                }
                let updateResult = await updateAllUsersAssignedCoins(context.request.body.team, context.request.body.coin)
                context.body = updateResult.body
                return context.status = updateResult.statusCode
            } else {
                context.body = {error: "Not Allowed"}
                return context.status = 403
            }
        } catch (error) {
            console.log("Error In UserController/UpdateAllUsersAssignedCoin:", error)
            context.status = 500
            context.body = error
        }
    })
}

async function getAssignedCoinsFromConfig(team) {
    let config = await getConfig(team).then()
    if (!config.success) console.log("error In getting config: " + config.body.error)
    return config
}

async function GetUsers(router) {
    router.get("/backEnd/:userId/users", async (context, next) => {
        try {
            if (context.request.body.password) {
                let getUserResult = await getUser(context.params.userId, context.request.body.password).then()
                if (!getUserResult.success) {
                    context.body = getUserResult.body
                    return context.status = getUserResult.status
                }
            } else {
                let token = context.cookies.get("access_token")
                const data = jwt.verify(token, "SecretKey");
                if (data.username !== context.params.userId) {
                    return context.body = {error: "Access Denied!"}
                        .status = 403
                }
            }
            let team = context.request.body.team
            if (team === undefined) {
                context.body = "please define team!"
                return context.status = 400
            }
            let getAllUsersResult = await getUsers(team)
            if (!getAllUsersResult.success) {
                context.body = getAllUsersResult.body.error
                return context.status = getAllUsersResult.statusCode
            } else {
                return context.body = getAllUsersResult.body.filter((item) => item.username !== context.params.userId);
            }
        } catch (error) {
            console.log("Error In UserController/GetUsers:", error)
            context.status = 500
            context.body = error
        }
    })
}

async function GetTopUsers(router) {
    router.get("/backEnd/:userId/topUsers", async (context, next) => {
        try {
            if (context.request.body.password) {
                let getUserResult = await getUser(context.params.userId, context.request.body.password).then()
                if (!getUserResult.success) {
                    context.body = getUserResult.body
                    return context.status = getUserResult.status
                }
            } else {
                let token = context.cookies.get("access_token")
                const data = jwt.verify(token, "SecretKey");
                if (data.username !== context.params.userId) {
                    return context.body = {error: "Access Denied!"}
                        .status = 403
                }
            }

            let topUsers = await getUsersByReceivedCoins()
            console.log(topUsers)
            context.status = topUsers.statusCode
            return context.body = topUsers.body
        } catch (error) {
            console.log("Error In UserController/GetTopUsers:", error)
            context.status = 500
            context.body = error
        }
    })
}

module.exports = {
    PostUser,
    GetUsers,
    UpdateAllUsersAssignedCoin,
    GetTopUsers
}