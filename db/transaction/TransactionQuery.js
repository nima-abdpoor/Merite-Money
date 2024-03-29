const transaction = require("../../model/Transaction")
const {asyncAll} = require("nunjucks/src/runtime");

async function transferQuery(_transfer) {
    try {
        await transaction.create({
            amount: _transfer.amount,
            date: _transfer.date,
            description: _transfer.description,
            fromId: _transfer.fromId,
            toId: _transfer.toId,
            team: _transfer.team
        });
        return {success: true, statusCode: 200};
    } catch (error) {
        console.error("TransactionQuery.js" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

async function getTransaction(_transaction) {
    try {
        const endDate = new Date();
        endDate.setMonth(new Date().getDay()  + 15, 1);
        endDate.setHours(0, 0, 0, 0);

        if (_transaction.from) {
            // let dateQuery = { $month: new Date().toISOString().getMonth() + 1 }
            if (_transaction.to){
                let result = await transaction.find({fromId: _transaction.from,toId: _transaction.to, date:  {$lt: endDate}, team: _transaction.team }, {"date": 1, "description": 1,"fromId": 1,"toId": 1, "_id": 0}).sort({date: -1})
                return {success: true, statusCode: 200, body: result}
            }
            let result = await transaction.find({fromId: _transaction.from, date:  {$lt: endDate}, team: _transaction.team }, {"date": 1, "description": 1,"fromId": 1,"toId": 1, "_id": 0}).sort({date: -1})
            return {success: true, statusCode: 200, body: result}
        } else if (_transaction.to) {
            let result = await transaction.find({toId: _transaction.to, date:  {$lt: endDate}, team: _transaction.team },  {"date": 1, "description": 1,"fromId": 1, "_id": 0}).sort({date: -1})
            return {success: true, statusCode: 200, body: result}
        }else if (_transaction.all){
            let result = await transaction.find({ team: _transaction.team },  {"date": 1, "description": 1,"fromId": 1,"toId": 1, "_id": 0}).sort({date: -1})
            return {success: true, statusCode: 200, body: result}
        }else {
            return {success: false, statusCode: 401, body: {error: "Invalid Query"}}
        }
    } catch (error) {
        console.error("TransactionQuery.js/getTransaction: " + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

module.exports = {
    transferQuery,
    getTransaction
}