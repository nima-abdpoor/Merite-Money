const {transferMoney, getTransactions} = require("./transaction/TransactionController")
const {PostUser, GetUsers} = require("./user/UserController")
const initConfigController = require("./config/ConfigController")
const {LoginController, GetLogin} = require("./login/LoginController");
const RootController = require("./root/RootController");
const GetDashboard = require("./dashboard/DashboardController");

async function startController(router) {
    //Root
    await RootController(router)

    //Config
    await initConfigController(router)

    //User
    await PostUser(router)
    await GetUsers(router)

    //Transactions
    await transferMoney(router)
    // await getTransactions(router, {from: context.params.userId})

    //Login
    await LoginController(router)
    await GetLogin(router)

    //DashBoard
    await GetDashboard(router)
}

module.exports = startController