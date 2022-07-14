const {MessageEmbed, MessageAttachment} = require("discord.js");
module.exports = {
    name: "help",
    description: "Battlecat help command",
    aliases: ["h"],
    utilization: `${client.config.settings.prefix}battlecat help [page number]`,
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
        const commands = [...client.battlecats.filter((x) => x.showHelp !== false && !x.exclude)].map((command, index) => `${index + 1} - **${command[1].name}**\n${command[1].utilization}\n${command[1].description}${command[1].aliases.length > 0 ? `\n(${client.config.settings.prefix}bc ` + command[1].aliases.join(", " + client.config.settings.prefix + "bc ") + ')' : ""}`);
        const creator = client.users.cache.get("236899263513231362");

        let chunks = [], size = 5;
        while (commands.length > 0) chunks.push(commands.splice(0, size));

        if (args.length === 0) args.push("1");
        if (args.join("") > chunks.length || args.join("") <= 0 || !Number.isInteger(parseInt(args.join("")))) return message.reply(`Ongeldige parameter, ben je dom? :nerd:`);

        embed.setColor("BLURPLE")
        embed.setTitle(`**Battlecats**, laat je klote katten met elkaar strijden.`);
        embed.setDescription(`Alle commando's voor Battlecats.\n\n${chunks[args - 1].join("\n\n")}\n\n*Pagina ${args}/${chunks.length}*`);
        embed.setThumbnail(`https://cdn.discordapp.com/avatars/${creator.id}/${creator.avatar}.jpeg`);
        embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
        embed.setTimestamp();

        message.channel.send({embeds: [embed]});
    }
}