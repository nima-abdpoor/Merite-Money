const { Client, GatewayIntentBits } = require('discord.js');
const {PickRandomEmojis} = require("../util/EmojiPicker");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let chan = {}
async function sendMessage(fromId, toId, description){
    const result = await chan.send(`
    <@${fromId}> قدردانی میکنه از <@${toId}> 
    : ${description}
    `)
    const emojis = PickRandomEmojis(10)
    for (const entry of emojis) {
        await result.react(entry)
    }
}

function provideDiscordBot(){
    client.login('MTE3NDU5OTg0MjMyOTI4MDUzMw.GfoqZ8.DnGL19PCzZpNnKTumssGlDWVHslTh9qh4vaFXc');
    client.on('ready', () => {
        console.log("DiscordBot is Ready...")
        chan = client.channels.cache.get("960245583883403299");
    });
}

module.exports = {
    sendMessage,
    provideDiscordBot
}