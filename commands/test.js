const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    showHelp: false,
    utilization: "{prefix}help",

    execute(client, message, args) {
        const embed = new MessageEmbed();

        message.channel.send(`We doen even testen... \nArgs: ${args}`);
    },
}