const mongoose = require("mongoose");

const db = mongoose.connection

db.on("error", (err) => console.log(`Error DB Not Connected: ${err}`))
db.on("connected", () => console.log("DataBase is Connected."))
db.on("disconnected", () => console.log("DataBase is disconnected."))
db.on("open", () => console.log("DataBase connection is open."))

function connectDatabase(){
    let dbUpdate = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    mongoose.connect("mongodb://0.0.0.0:27017/", dbUpdate)
}

module.exports = connectDatabase