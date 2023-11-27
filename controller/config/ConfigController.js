const getUser = require("../util/CheckExistingUser")
const {createConfig} = require("../../db/config/ConfigQuery");
const jwt = require("jsonwebtoken");
const UserModel = require("../../model/User");

async function PostConfig(router) {
    router.post("/:userId/config", async (context, next) => {
        try {
            let getUserResult = await getUser(context.params.userId, context.request.body.password).then()
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            }
            if (context.request.body.config.assignedCoins === undefined ||
                context.request.body.config.team === undefined
            ) {
                context.body = {error: "define assignedCoins and team"}
                return context.status = 401
            }
            let team = context.request.body.config.team
            if (!(team === "kilid" || team === "kariz" || team === "shakeylead")) {
                context.body = {error: "team should be defined correctly."}
                return context.status = 401
            }
            if (getUserResult.body[0].role.includes("Admin") || getUserResult.body[0].role.includes("SuperAdmin")) {
                let configCreationResult = await createConfig({
                    assignedCoins: context.request.body.config.assignedCoins,
                    team: team
                })
                context.body = configCreationResult.body
                return context.status = configCreationResult.statusCode
            } else {
                context.body = {error: "Not Allowed"}
                return context.status = 403
            }
        } catch (error) {
            console.log("Error In ConfigController:", error)
            context.status = 500
            context.body = error
        }
    })
}

async function GetConfig(router) {
    router.get("/backEnd/config", async (context, next) => {
        try {
            let token = context.cookies.get("access_token")
            const data = jwt.verify(token, "SecretKey");
            const user = await UserModel.find({username: data.username})
            return context.body = {
                username: user[0].username,
                assignedCoins: user[0].assignedCoins,
                receivedCoins: user[0].receivedCoins,
                team: user[0].team
            }
        } catch (error) {
            if (error.name === "JsonWebTokenError") context.status = 403
            else {
                console.log("Error In GetConfigController:", error)
                context.status = 500
            }
            return context.body = {error: error}
        }
    })
}

module.exports = {
    PostConfig,
    GetConfig
}