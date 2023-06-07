const koa = require("koa")
const KoaRouter = require("koa-router")
const views = require("koa-views")
const parser = require("koa-bodyparser")
const htmlRender = require("koa-html-render")

// const cookieParser = require("cookie-parser");

const server = new koa()
const router = KoaRouter()

//middleware

function startServer(){
    server.use(parser())
    server.use(views("./views", {map: {html: "nunjucks"}}))
    // server.use(cookieParser())
    server.use(router.routes())
    server.use(htmlRender())
    server.listen(8086, "127.0.0.1", () => {
        console.log("salam")
    })
}

module.exports = {
    startServer,
    router
}