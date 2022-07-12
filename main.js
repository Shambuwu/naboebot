const { Client, Intents } = require("discord.js");
const { Player } = require("discord-player");

global.client = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS
    ]
});

client.config = require("./config.json");
client.msgCounter = 0;

global.player = new Player(client);

client.login(client.config.authorization.token).then(async (result) => {
    console.log(`Client logged in on token ${result}`)
    global.db = require("./src/database.js");
    await require("./src/loader.js");
    await require('./commands/battlecat/loader');
});