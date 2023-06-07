const initTransactionController = require("./transaction/TransactionController")
const {PostUser, GetUsers} = require("./user/UserController")
const initConfigController = require("./config/ConfigController")
const {LoginController, GetLogin} = require("./login/LoginController");
const RootController = require("./root/RootController");
const GetDashboard = require("./dashboard/DashboardController");

async function startController(router) {
    await PostUser(router)
    await GetUsers(router)
    await initConfigController(router)
    await initTransactionController(router)
    await LoginController(router)
    await GetLogin(router)
    await RootController(router)
    await GetDashboard(router)
}

module.exports = startController