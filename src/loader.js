const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

client.commands = new Collection();

console.log("Loading events...");

readdirSync("./events/").forEach(dir => {
    const events = readdirSync(`./events/${dir}/`);
    for (const file of events) {
        const event = require(`../events/${dir}/${file}`);
        let filename = file.split(".")[0];
        if (dir === "client") {
            client.on(filename, event.bind(null, client));
        } else {
            player.on(filename, event.bind(null, player));
        }
        console.log(`-> Loaded event: ${filename}`);
        delete require.cache[require.resolve(`../events/${dir}/${file}`)];
    }
})


console.log("Loading commands...");

readdirSync("./commands/").forEach((file) => {
    const command = require(`../commands/${file}`);
    let filename = file.split(".")[0];
    console.log(`-> Loaded command: ${filename}`);
    client.commands.set(command.name.toLowerCase(), command);
    delete require.cache[require.resolve(`../commands/${file}`)];
})