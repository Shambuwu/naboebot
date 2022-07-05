const { Client, GuildMember, Intents } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

global.client = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS
    ]
});

global.player = new Player(client);

client.login(config.token).then(r => {
    console.log("Client logged in on token: " + r)
});

require("./src/loader.js");