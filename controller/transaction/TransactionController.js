const getUser = require("../CheckExistingUser");
const {updateUserReceivedCoins, updateUserAssignedCoins} = require("../../db/user/UserQuery");
const user = require("../../model/User");
const transferQuery = require("../../db/transaction/TransactionQuery");

async function transferMoney(router) {
    router.post("/:userId/transfer", async (context, next) => {
        try {
            let userId = context.params.userId
            let getUserResult = await getUser(userId, context.request.body.password).then()
            if (!getUserResult.success) {
                context.body = getUserResult.body
                return context.status = getUserResult.status
            } else {
                let amount = context.request.body.transfer.amount
                if (amount > 0) {
                    if (getUserResult.body[0].assignedCoins >= amount) {
                        if (context.request.body.transfer.destination === userId) {
                            context.body = {error: "Not Allowed"}
                            return context.status = 403
                        } else {
                            let destinationUsername = context.request.body.transfer.destination
                            const destination = await user.find({username: destinationUsername})
                            if (!"username" in destination || destination.length === 0) {
                                context.status = 401
                                return context.body = {error: "Destination Username Not Found"}
                            } else {
                                let updateUserAssignCoinsResult = await updateUserAssignedCoins(userId, -amount)
                                if (updateUserAssignCoinsResult.success) {
                                    let updateUserReceivedCoinsResult = await updateUserReceivedCoins(destination[0].username, amount)
                                    if (updateUserReceivedCoinsResult.success) {
                                        let transferMoneyResult = await transferQuery({
                                            amount: amount,
                                            description: context.request.body.transfer.description,
                                            fromId: userId,
                                            toId: destination[0].username,
                                            date: new Date()
                                        })
                                        if (!transferMoneyResult.success) {
                                            console.log("transferMoneyResult:" + transferMoneyResult.body.error)
                                            context.body = transferMoneyResult.body.error
                                            return context.status = 500
                                        } else {
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
                        return context.status = 401
                    }
                } else {
                    context.body = {error: "Invalid Amount"}
                    return context.status = 401
                }

            }
        } catch (error) {
            console.log("Error In ConfigController:", error)
            context.body = error
            return context.status = 500
        }
    })
}

module.exports = transferMoney