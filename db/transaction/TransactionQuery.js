const transaction = require("../../model/Transaction")

async function transferQuery(_transfer) {
    try {
        await transaction.create({
            amount: _transfer.amount,
            date: _transfer.date,
            description: _transfer.description,
            fromId: _transfer.fromId,
            toId: _transfer.toId
        });
        return {success: true, statusCode: 200};
    } catch (error) {
        console.error("TransactionQuery.js" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

module.exports = transferQuery