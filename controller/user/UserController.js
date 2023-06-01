const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")
const user = require("../../model/User")
const {_explicitStatus} = require("koa/lib/response");
const { createUser, updateUserRole } = require("../../db/user/UserQuery")

async function init(router) {
    router.post("/:userId/user", async (context, next) => {
        try {
            const requester = await user.find({username: context.params.userId})
            if (!"username" in requester) {
                context.body = "User Not Found"
                return context.status = 404
            }
            if (context.request.body.username === undefined &&
                context.request.body.password === undefined &&
                context.request.body.roles === undefined
            ) {
                context.body = "define username, password and roles"
                return context.status = 401
            } else {
                let _role = context.request.body.role
                const _user = await user.find({username: context.request.body.username})
                if (!_user[0] || !"username" in _user) {
                    // user in body is not in database
                    if (requester[0].role.includes("SuperAdmin")) {
                        if (_role === "SuperAdmin") {
                            context.body = "Not Allowed"
                            return context.status = 403
                        } else {
                            if (_role === "Admin" || _role === "User") {
                                let creationUserResult = await createUser({
                                    username: context.request.body.username,
                                    password: context.request.body.password,
                                    role: [_role],
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
                            let creationUserResult = await createUser({
                                username: context.request.body.username,
                                password: context.request.body.password,
                                role: [_role],
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
                            let roles = _user[0].role
                            roles.push(_role)
                            let updateUserResult = await updateUserRole(context.request.body.username, roles)
                            context.body = updateUserResult.body
                            context.status = updateUserResult.statusCode
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

module.exports = init