const {MessageEmbed, MessageAttachment} = require("discord.js");
module.exports = {
    name: "help",
    description: "Battlecat help command",
    aliases: ["h"],
    utilization: `${client.config.settings.prefix}battlecat help`,

    execute(client, message, args) {
        console.log(args);
        const embed = new MessageEmbed();
        const commands = [...client.battlecats.filter((x) => x.showHelp !== false && !x.exclude)].map((command, index) => `${index + 1} - **${command[1].name}**\n${command[1].utilization}\n${command[1].description}${command[1].aliases.length > 0 ? `\n(`+ client.config.settings.prefix + command[1].aliases.join(", " + client.config.settings.prefix) + ')' : ""}`);
        const image = new MessageAttachment(`./assets/client/${client.config.settings.thumbnail}`);

        let chunks = [], size = 5;
        while (commands.length > 0) chunks.push(commands.splice(0, size));

        if (args.length === 0) args.push("1");
        if (args.join("") > chunks.length || args.join("") <= 0 || !Number.isInteger(parseInt(args.join("")))) return message.reply(`Ongeldige parameter, ben je dom? :nerd:`);

        embed.setColor("BLURPLE")
        embed.setTitle(`${client.config.settings.name}, tot uw dienst :moyai:`);
        embed.setDescription(`**Battlecats**, gemaakt door **${client.users.cache.get("236899263513231362").username}#${client.users.cache.get("236899263513231362").discriminator}**`);
        if (parseInt(args) === chunks.length) {
            embed.setImage(`attachment://${client.config.settings.thumbnail}`);
        } else {
            embed.setThumbnail(`attachment://${client.config.settings.thumbnail}`);
        }
        embed.setTimestamp();

        message.channel.send({embeds: [embed], files: [image]});
    }
}