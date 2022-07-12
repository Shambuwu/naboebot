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

readdirSync("./commands/").forEach((dir) => {
    if (dir.toLowerCase() === "battlecat") return;
    const commands = readdirSync((`./commands/${dir}/`))
    for (const file of commands) {
        const command = require(`../commands/${dir}/${file}`);
        if (command.exclude) return;
        let filename = file.split(".")[0];
        console.log(`-> Loaded command: ${filename}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`../commands/${dir}/${file}`)];
    }
})

// console.log("Loading battlecat commands...")
//
// const bcCommands = readdirSync("./commands/battlecat/");
// for (const file of bcCommands) {
//     const command = require(`./commands/battlecat/${file}`);
//     if (command.exclude) return;
//     console.log(`-> Loaded command: ${command.name}`);
//     client.battlecats.set(command.name.toLowerCase(), command);
//     delete require.cache[require.resolve(`./commands/battlecat/${file}`)];
// }
//TODO: Cannot find module??