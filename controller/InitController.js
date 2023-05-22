const initTransactionController = require("./transaction/TransactionController")
const initUserController = require("./user/UserController")
const KoaRouter = require("koa-router");

function startController(router){
    initUserController(router)
}

module.exports = startController