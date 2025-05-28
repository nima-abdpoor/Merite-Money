async function RootController(router) {
    router.get("/", async (context, next) => {
        return await context.render("./index.html")
    })
}

module.exports = RootController