const controller = require("./controller/InitController")
const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")


main()
function main(){
    initDB()
    server.startServer()
    controller(server.router).then()
}