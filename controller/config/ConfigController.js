const getUser = require("../CheckExistingUser")
const {createConfig} = require("../../db/config/ConfigQuery");

async function PostConfig(router) {
    router.post("/:userId/config", async (context, next) => {
        try {
            let getUserResult = await getUser(context.params.userId, context.request.body.password).then()
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            } else {
                if (getUserResult.body[0].role.includes("Admin") || getUserResult.body[0].role.includes("SuperAdmin")) {
                    let configCreationResult = await createConfig({
                        assignedCoins: context.request.body.config.assignedCoins
                    })
                    context.body = configCreationResult.body
                    return context.status = configCreationResult.statusCode
                } else {
                    context.body = {error: "Not Allowed"}
                    return context.status = 403
                }
            }
        } catch (error) {
            console.log("Error In ConfigController:", error)
            context.status = 500
            context.body = error
        }
    })
}

module.exports = PostConfig