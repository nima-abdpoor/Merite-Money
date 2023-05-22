const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")

const server = new koa()
const router = KoaRouter()

//middleware

function startServer(){
    server.use(parser())
    server.use(router.routes())
    server.listen(8086, "127.0.0.1", () => {
        console.log("salam")
    })
}

module.exports = {
    startServer,
    router
}