const express = require('express');

async function RootController(router) {
    router.get("/", async (context, next) => {
        await context.render("index")
    })
}

module.exports = RootController