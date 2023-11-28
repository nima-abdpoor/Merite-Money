const getUser = require("../util/CheckExistingUser");
const {updateUserReceivedCoins, updateUserAssignedCoins, getUsers} = require("../../db/user/UserQuery");
const user = require("../../model/User");
const {transferQuery, getTransaction} = require("../../db/transaction/TransactionQuery");
const jwt = require("jsonwebtoken");
const {sendMessage} = require("../../service/discord");

async function transferMoney(router) {
    router.post("/backEnd/:userId/transfer", async (context, next) => {
        try {
            let userResult
            let destinationUser
            let userId = context.params.userId
            let getUserResult
            if (context.request.body.password) {
                getUserResult = await getUser(userId, context.request.body.password).then()
                if (!getUserResult.success) {
                    context.body = getUserResult.body
                    return context.status = getUserResult.status
                }
            } else {
                userResult = await user.find({username: userId})
                getUserResult = {body: []}
                getUserResult.body.push(userResult[0])
                let token = context.cookies.get("access_token")
                const data = jwt.verify(token, "SecretKey");
                if (data.username !== context.params.userId) {
                    context.redirect("/login")
                    return context.body = {error: "Access Denied!"}
                        .status = 403
                }
            }
            let amount = context.request.body.transfer.amount
            if (amount > 0) {
                if (getUserResult.body[0].assignedCoins >= amount) {
                    if (context.request.body.transfer.destination === userId) {
                        context.body = {error: "Not Allowed"}
                        return context.status = 403
                    } else {
                        let destinationUsername = context.request.body.transfer.destination
                        destinationUser = await user.find({username: destinationUsername})
                        if (!"username" in destinationUser || destinationUser.length === 0) {
                            context.status = 401
                            return context.body = {error: "Destination Username Not Found"}
                        } else {
                            let updateUserAssignCoinsResult = await updateUserAssignedCoins(userId, -amount)
                            if (updateUserAssignCoinsResult.success) {
                                let updateUserReceivedCoinsResult = await updateUserReceivedCoins(destinationUser[0].username, amount)
                                if (updateUserReceivedCoinsResult.success) {
                                    let transferMoneyResult = await transferQuery({
                                        amount: amount,
                                        description: context.request.body.transfer.description,
                                        fromId: userId,
                                        toId: destinationUser[0].username,
                                        date: new Date()
                                    })
                                    if (!transferMoneyResult.success) {
                                        console.log("transferMoneyResult:" + transferMoneyResult.body.error)
                                        context.body = transferMoneyResult.body.error
                                        return context.status = 500
                                    } else {
                                        if (process.env.DISCORD_BOT_ACTIVE === "true" && userResult[0].discordId && destinationUser[0].discordId)
                                            Promise.resolve(sendMessage(userResult[0].discordId, destinationUser[0].discordId, context.request.body.transfer.description))
                                        context.body = {success: true}
                                        return context.status = 200
                                    }
                                } else {
                                    await updateUserAssignedCoins(userId, amount)
                                    console.log("updateUserReceivedCoinsResult:" + updateUserReceivedCoinsResult.body.error)
                                    context.body = updateUserReceivedCoinsResult.body.error
                                    return context.status = 500
                                }
                            } else {
                                context.body = updateUserAssignCoinsResult.body.error
                                return context.status = 500
                            }
                        }
                    }
                } else {
                    context.body = {error: "You Dont Have Enough Coins!"}
                    return context.status = 400
                }
            } else {
                context.body = {error: "Invalid Amount"}
                return context.status = 400
            }
        } catch (error) {
            if (error.message === "jwt must be provided") {
                context.body = {error: "403: " + error.message}
                return context.status = 403
            }
            console.log("Error In ConfigController:", error.message)
            context.body = {error: error}
            return context.status = 500
        }
    })
}

async function getTransactions(router) {
    router.get("/backEnd/:userId/transactions", async (context, next) => {
        try {
            let userId = context.params.userId
            let getUserResult
            if (context.request.body.password) {
                getUserResult = await getUser(userId, context.request.body.password).then()
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
            let u = await user.find({username: context.params.userId})
            let result
            if (context.request.body.from !== undefined && context.request.body.to !== undefined) result = await getTransaction({
                from: context.request.body.from,
                to: context.request.body.to,
                team: u[0].team
            })
            else if (context.request.body.from !== undefined) result = await getTransaction({from: context.request.body.from, team: u[0].team})
            else if (context.request.body.to !== undefined) result = await getTransaction({to: context.request.body.to, team: u[0].team})
            else result = await getTransaction({all: "all", team: u[0].team})
            context.status = result.statusCode
            return context.body = result.body
        } catch (error) {
            if (error.message === "jwt must be provided") {
                context.body = {error: "403: " + error.message}
                return context.status = 403
            }
            console.log("Error In getTransactions:", error.message)
            context.body = {error: error}
            return context.status = 500
        }
    })
}

module.exports = {
    transferMoney,
    getTransactions
}