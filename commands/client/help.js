const {MessageEmbed, MessageAttachment} = require("discord.js");

module.exports = {
    name: "help",
    description: "Shows all available commands",
    aliases: ["h"],
    showHelp: false,
    utilization: `${client.config.settings.prefix}help [page number]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Which help page you want to request",
            type: "STRING",
            required: false,
        }
    ],

    execute(client, message, args) {
        const embed = new MessageEmbed();
        const commands = [...client.commands.filter((x) => x.showHelp !== false && !x.exclude)].map((command, index) => `${index + 1} - **${command[1].name}**\n${command[1].utilization}\n${command[1].description}${command[1].aliases.length > 0 ? `\n(`+ client.config.settings.prefix + command[1].aliases.join(", " + client.config.settings.prefix) + ')' : ""}`);
        const image = new MessageAttachment(`./assets/client/${client.config.settings.thumbnail}`);

        let chunks = [], size = 5;
        while (commands.length > 0) chunks.push(commands.splice(0, size));

        if (args.length === 0) args.push("1");
        if (args.join("") > chunks.length || args.join("") <= 0 || !Number.isInteger(parseInt(args.join("")))) return message.reply(`Ongeldige parameter, ben je dom? :nerd:`);

        embed.setColor("BLURPLE")
        embed.setTitle(`${client.config.settings.name}, tot uw dienst :moyai:`);
        embed.setDescription(`Alle commando's die ik, ${client.config.settings.name}, kan uitvoeren.\n\n${chunks[args - 1].join("\n\n")}\n\n**Pagina ${args}/${chunks.length}**`);
        if (parseInt(args) === chunks.length) {
            embed.setImage(`attachment://${client.config.settings.thumbnail}`);
        } else {
            embed.setThumbnail(`attachment://${client.config.settings.thumbnail}`);
        }
        embed.setTimestamp();

        message.channel.send({embeds: [embed], files: [image]});
    },
}