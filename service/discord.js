const { Client, GatewayIntentBits } = require('discord.js');
const {PickRandomEmojis} = require("../util/EmojiPicker");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let chan = {}
async function sendMessage(fromId, toId, description){
    const result = await chan.send(`
    <@${fromId}> قدردانی میکنه از <@${toId}> 
    : ${description}
    `)
    const emojis = PickRandomEmojis(process.env.DISCORD_REACTION_NUMBER)
    for (const entry of emojis) {
        await result.react(entry)
    }
}

function provideDiscordBot(){
    client.login(process.env.DISCORD_TOKEN);
    client.on('ready', () => {
        console.log("DiscordBot is Ready...")
        chan = client.channels.cache.get(process.env.DISCORD_CHANNEL);
    });
}

module.exports = {
    sendMessage,
    provideDiscordBot
}