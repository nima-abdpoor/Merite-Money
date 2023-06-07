const getUser = require("../util/CheckExistingUser");
const user = require("../../model/User");
const jwt = require('jsonwebtoken');
const {getUsers} = require("../../db/user/UserQuery");

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
                    let getAllUsersResult = await getUsers()
                    let allUsernames = ""
                    getAllUsersResult.body.forEach(function(user) {
                        allUsernames += user.username + ","
                    });

                    await context.render("dashboard",
                        {username: requester[0].username, receivedCoins: requester[0].receivedCoins, walletCoins: requester[0].assignedCoins,
                        selection: allUsernames.slice(0, -1) }
                    );
                    return context.status = 200
                } catch {
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

module.exports = GetDashboard
