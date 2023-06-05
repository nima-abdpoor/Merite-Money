const config = require("../../model/Config")

async function createConfig(_config) {
    try {
        await config.create({
            assignedCoins: _config.assignedCoins
        });
        return {body: {success: true}, statusCode: 200};
    } catch (error) {
        console.error("ConfigQuery.js" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}

async function getConfig() {
    try {
        let result = await config.find().limit(1).sort({$natural: -1})
        return {body: result, statusCode: 200, success: true};
    } catch (error) {
        console.error("ConfigQuery.js" + error.name + error.code + "error:", error);
        return {body: {error: error.message}, success: false, statusCode: 500};
    }
}


module.exports = {
    createConfig,
    getConfig
}