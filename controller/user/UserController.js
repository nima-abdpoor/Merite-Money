const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")
const transaction = require("../../model/User")

function init(router){
    router.get("/", (context, next) => {
        return context.body = "is OK!"
    })
}

module.exports = init