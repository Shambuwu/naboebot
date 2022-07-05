const { MessageEmbed, MessageAttachment} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    showHelp: false,
    utilization: "!help",

    execute(client, message, args) {
        const embed = new MessageEmbed();
        const commands = client.commands.filter(x => x.showHelp !== false);
        const image = new MessageAttachment("./assets/Screenshot_7.png");
        const image2 = new MessageAttachment("./assets/Screenshot_8.png");
        const image3 = new MessageAttachment("./assets/Screenshot_9.jpg");

        embed.setColor("BLURPLE");
        embed.setTitle("Mecha Naboe, tot uw dienst.");
        embed.setDescription("Alle commando's die ik, Mecha Naboe, kan uitvoeren.");
        embed.setThumbnail("attachment://Screenshot_8.png");
        // embed.setAuthor({name: "Shambuwu", iconURL: "attachment://Screenshot_9.jpg", url: "https://www.google.com/search?q=deze+noten"})
        commands.forEach((command) => {
            embed.addField(command.name, command.utilization, false);
        })
        // embed.addField(`Enabled - ${commands.size}`, commands.map(x => `\`${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join(' | '));
        // embed.setImage("attachment://Screenshot_7.png")
        embed.setTimestamp();

        message.channel.send({embeds: [embed], files: [image, image2, image3]});
    },
}