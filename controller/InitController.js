const initTransactionController = require("./transaction/TransactionController")
const initUserController = require("./user/UserController")
const initConfigController = require("./config/ConfigController")

function startController(router){
    initUserController(router)
    initConfigController(router)
    // initTransactionController(router)
}

module.exports = startController