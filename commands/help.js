const { MessageEmbed, MessageAttachment} = require("discord.js");
const settings = require("../config.json");

module.exports = {
    name: "help",
    aliases: ["h"],
    showHelp: false,
    utilization: "!help",

    execute(client, message, args) {

        const embed = new MessageEmbed();
        const commands = client.commands.filter(x => x.showHelp !== false);
        const image = new MessageAttachment(`./assets/Screenshot_7.png`);

        embed.setColor("BLURPLE")
        embed.setTitle(`Mecha Naboe, tot uw dienst :moyai:`);
        embed.setDescription("Alle commando's die ik, Mecha Naboe, kan uitvoeren.");
        commands.forEach((command) => {
            embed.addField(command.name, command.utilization, false);
        })
        embed.setImage("attachment://Screenshot_7.png");
        embed.setTimestamp();

        message.channel.send({embeds: [embed], files: [image]});
    },
}