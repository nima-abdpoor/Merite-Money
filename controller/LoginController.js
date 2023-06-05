const getUser = require("./CheckExistingUser");
const jwt = require('jsonwebtoken');

async function LoginController(router) {
    router.post("/login", async (context, next) => {
        try {
            let getUserResult = await getUser(context.request.body.username, context.request.body.password).then()
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            } else {
                const tokenPayload = {
                    username: context.request.body.username,
                };
                const accessToken = jwt.sign(tokenPayload, "SecretKey");
                context.cookies.set("access_token", accessToken, {
                    httpOnly: true,
                })
                    return context.body = {success: true, token: accessToken}
                    .status = 200
            }
        } catch (error) {
            console.log("Error In LoginController:", error)
            context.status = 500
            return context.body = {error: error}
        }
    });
}

async function GetLogin(router) {
    router.get("/login", async (context, next) => {
        await context.render("login")
    })
}

module.exports = {
    LoginController,
    GetLogin
}