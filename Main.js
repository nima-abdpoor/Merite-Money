const controller = require("./controller/InitController")
const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")
const {provideDiscordBot} = require("./service/discord");


main()
function main(){
    initDB()
    server.startServer()
    provideDiscordBot()
    controller(server.router).then()
}