const initTransactionController = require("./transaction/TransactionController")
const {PostUser, GetUsers} = require("./user/UserController")
const initConfigController = require("./config/ConfigController")
const {LoginController, GetLogin} = require("./LoginController");
const RootController = require("./root/RootController");

async function startController(router) {
    await PostUser(router)
    await GetUsers(router)
    await initConfigController(router)
    await initTransactionController(router)
    await LoginController(router)
    await GetLogin(router)
    await RootController(router)
}

module.exports = startController