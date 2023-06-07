const user = require("../../model/User")
const {createUser, updateUserRole, getUsers} = require("../../db/user/UserQuery")
const isPasswordMatches = require("../util/PasswordDecryption")
const {getConfig} = require("../../db/config/ConfigQuery");
const getUser = require("../util/CheckExistingUser");

async function PostUser(router) {
    router.post("/:userId/user", async (context, next) => {
        try {
            const requester = await user.find({username: context.params.userId})
            if (!"username" in requester) {
                context.body = "User Not Found"
                return context.status = 404
            }
            isPasswordMatches(context.request.body.password, requester[0].password, (error, isMatch) => {
                if (error) {
                    context.body = "Error Accrued!" + error
                    return context.status = 500
                } else {
                    if (!isMatch) {
                        context.body = "Incorrect Password!"
                        return context.status = 401
                    }
                }
            });
            if (context.request.body.user.username === undefined &&
                context.request.body.user.password === undefined &&
                context.request.body.user.roles === undefined
            ) {
                context.body = "define username, password and roles"
                return context.status = 401
            } else {
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
                                let config = await getAssignedCoinsFromConfig()
                                let creationUserResult = await createUser({
                                    username: context.request.body.user.username,
                                    password: context.request.body.user.password,
                                    role: [_role],
                                    assignedCoins: config.body[0].assignedCoins,
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
                            let config = await getAssignedCoinsFromConfig()
                            let creationUserResult = await createUser({
                                username: context.request.body.user.username,
                                password: context.request.body.user.password,
                                role: [_role],
                                assignedCoins: config.body[0].assignedCoins,
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
            }
        } catch (error) {
            console.log("Error In UserController:", error)
            context.status = 500
            context.body = error
        }
    })
}

async function getAssignedCoinsFromConfig() {
    let config = await getConfig().then()
    if (!config.success) console.log("error In getting config: " + config.body.error)
    return config
}

async function GetUsers(router) {
    router.get("/:userId/users", async (context, next) => {
        try {
            let getUserResult = await getUser(context.params.userId, context.request.body.password).then()
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            } else {
                let getAllUsersResult = await getUsers()
                if (!getAllUsersResult.success) {
                    context.body = getAllUsersResult.body.error
                    return context.status = getAllUsersResult.statusCode
                } else {
                    return context.body = getAllUsersResult.body.filter((item) => item.username !== context.params.userId);
                }
            }
        } catch (error) {
            console.log("Error In UserController/GetUsers:", error)
            context.status = 500
            context.body = error
        }
    })
}

module.exports = {
    PostUser,
    GetUsers
}