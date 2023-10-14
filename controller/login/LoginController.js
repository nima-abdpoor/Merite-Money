const getUser = require("../util/CheckExistingUser");
const jwt = require('jsonwebtoken');
const { createReadStream } =  require("fs");

const views = require("co-views");
const render = views("views", { map: { html: 'swig' }})

async function LoginController(router) {
    router.post("/backEnd/login", async (context, next) => {
        try {
            let getUserResult = await getUser(context.request.body.username, context.request.body.password)
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            } else {
                const tokenPayload = {
                    username: context.request.body.username,
                };
                const accessToken = jwt.sign(tokenPayload, "SecretKey", {});
                context.cookies.set("access_token", accessToken, {
                    httpOnly: true,
                })
                context.status = 200
                return context.body = {
                    username: getUserResult.body[0].username,
                    assignedCoins: getUserResult.body[0].assignedCoins,
                    receivedCoins: getUserResult.body[0].receivedCoins,
                    team: getUserResult.body[0].team,
                    access_token: accessToken
                }
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
        context.body = await render("login");
    })
}

module.exports = {
    LoginController,
    GetLogin
}