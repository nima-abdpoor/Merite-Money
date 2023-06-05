const initTransactionController = require("./transaction/TransactionController")
const {PostUser, GetUsers} = require("./user/UserController")
const initConfigController = require("./config/ConfigController")

async function startController(router) {
    await PostUser(router)
    await GetUsers(router)
    await initConfigController(router)
    // initTransactionController(router)
}

module.exports = startController