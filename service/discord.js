const { Client, GatewayIntentBits } = require('discord.js');
const {PickRandomEmojis} = require("../util/EmojiPicker");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let chan = {}
let teamChannelMap = new Map()
async function sendMessage(fromId, toId, description, team){
    chan = teamChannelMap.get(team)
    const result = await chan.send(`
    <@${fromId}> قدردانی میکنه از <@${toId}> 
    : ${description}
    `)
    const emojis = PickRandomEmojis(process.env.DISCORD_REACTION_NUMBER)
    for (const entry of emojis) {
        await result.react(entry)
    }
}

function provideDiscordBot(teams){
    teams.forEach(team => {
        if (team.enable){
            client.login(process.env.DISCORD_TOKEN);
            client.on('ready', () => {
                console.log(`DiscordBot is Ready for ${team.name}...`)
                chan = client.channels.cache.get(team.channelId);
                teamChannelMap.set(team.name, chan)
            });
        }
    })
}

module.exports = {
    sendMessage,
    provideDiscordBot
}