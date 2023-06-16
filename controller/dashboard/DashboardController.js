const user = require("../../model/User");
const jwt = require('jsonwebtoken');
const {getUsers, getUsersByReceivedCoins} = require("../../db/user/UserQuery");
const {getTransaction} = require("../../db/transaction/TransactionQuery");

async function GetDashboard(router) {
    router.get("/:userId/dashboard", async (context, next) => {
        try {
            const requester = await user.find({username: context.params.userId})
            if (!"username" in requester || requester.length === 0) {
                return context.body = {error: "User Not Found"}
                    .status = 404
            } else {
                let token = context.cookies.get("access_token")
                try {
                    const data = jwt.verify(token, "SecretKey");
                    if (data.username !== context.params.userId){
                        context.redirect("/login")
                        return context.body = {error: "Access Denied!"}
                            .status = 403
                    }
                    let transactions = {}
                    let allTransactions = {}
                    let topUsers = {}
                    let getAllUsersResult = await getUsers()
                    transactions.sourceTransactions = (await getTransaction({from: context.params.userId})).body
                    transactions.destinationTransactions = (await getTransaction({to: context.params.userId})).body
                    if (requester[0].role.includes("Admin" || "SuperAdmin")) {
                        transactions.allTransactions = (await getTransaction({all: "0"})).body
                        transactions.topUsers = (await getUsersByReceivedCoins()).body
                        topUsers = preaparTopUsersForUI(transactions.topUsers)
                        allTransactions = preaparAllTransactionsForUI(transactions.allTransactions)
                    }
                    let allUsernames = ""
                    getAllUsersResult.body.forEach(function(user) {
                        allUsernames += user.username + ","
                    });

                    await context.render("dashboard",
                        {username: requester[0].username, receivedCoins: requester[0].receivedCoins, walletCoins: requester[0].assignedCoins,
                        selection: allUsernames.slice(0, -1), transferredMoney: preaparDestinationTransactionsForUI(transactions.destinationTransactions),
                        myTransactions: preaparSourceTransactionsForUI(transactions.sourceTransactions), allTransActions: allTransactions, topUsers: topUsers
                        }
                    );
                    return context.status = 200
                }
                catch(error) {
                    console.log(error)
                    context.redirect("/login")
                    return context.body = {error: "Invalid Token"}
                        .status = 403
                }
            }
        } catch (error) {
            console.log("Error In DashBoardController: ", error)
            context.body = error
            return context.status = 500
        }
    })
}

function preaparDestinationTransactionsForUI(transactions){
    let result = "";
    for (let i = 0; i < transactions.length; i++) {
        result = result + `${i}: ${transactions[i].fromId} sent you ${transactions[i].amount} at ${transactions[i].date} with description: ${transactions[i].description} \n`
    }
    return result
}

function preaparSourceTransactionsForUI(transactions){
    let result = "";
    for (let i = 0; i < transactions.length; i++) {
        result = result + `${i}: I Have sent ${transactions[i].amount} to ${transactions[i].toId} with description: ${transactions[i].description} \n`
    }
    return result
}

function preaparAllTransactionsForUI(transactions){
    let result = "";
    for (let i = 0; i < transactions.length; i++) {
        result = result + `${i}: ${transactions[i].fromId} Has sent ${transactions[i].amount} to ${transactions[i].toId} with description: ${transactions[i].description} \n`
    }
    return result
}

function preaparTopUsersForUI(users){
    let result = "";
    console.log(users)
    for (let i = 0; i < users.length; i++) {
        result = result + `${i}==> ${users[i].username}:${users[i].receivedCoins} \n`
    }
    console.log(result)
    return result
}

module.exports = GetDashboard
