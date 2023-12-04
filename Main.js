const controller = require("./controller/InitController")
const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")
const config = require('config')
const {provideDiscordBot} = require("./service/discord");
const dotenv = require("dotenv");



function main(){
    dotenv.config()
    initDB()
    server.startServer()
    if (config.discord.enable)
        provideDiscordBot(config.discord.team)
    controller(server.router).then()
}

main()