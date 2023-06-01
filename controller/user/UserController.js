const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")
const user = require("../../model/User")
const {_explicitStatus} = require("koa/lib/response");
const createUser = require("../../db/user/UserQuery")

async function init(router) {
    router.post("/:userId/user", async (context, next) => {
        try {
            const _user = await user.find({username: context.params.userId})
            if (!"username" in _user) {
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
                if (_user[0].role.includes("SuperAdmin")) {
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
                            context.status = creationUserResult.statusCode
                        } else {
                            context.body = {error: "Role Is Not Valid"}
                            return context.status = 401
                        }
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