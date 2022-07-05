const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

client.commands = new Collection();

const events = readdirSync("./events/");

console.log("Loading events...");

for(const file of events){
    const event = require("../events/" + file);
    console.log("-> Loaded event: " + file.split(".")[0]);
    client.on(file.split(".")[0], event.bind(null, client));
    delete require.cache[require.resolve("../events/" + file)];
}

console.log("Loading commands...");

readdirSync("./commands/").forEach((file) => {
    const command = require("../commands/" + file);
    console.log("-> Loaded command: " + file.split(".")[0]);
    client.commands.set(command.name.toLowerCase(), command);
    delete require.cache[require.resolve("../commands/" + file)];
})