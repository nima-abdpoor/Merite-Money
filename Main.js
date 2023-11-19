const controller = require("./controller/InitController")
const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")
const {provideDiscordBot} = require("./service/discord");
const dotenv = require("dotenv");



function main(){
    dotenv.config()
    initDB()
    server.startServer()
    if (process.env.DISCORD_BOT_ACTIVE === "true")
        provideDiscordBot()
    controller(server.router).then()
}

main()