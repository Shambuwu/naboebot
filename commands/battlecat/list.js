const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "list",
    description: "Battlecat list command, use to view your battlecats",
    aliases: ["l"],
    utilization: `${client.config.settings.prefix}battlecat list`,
    slashCommand: true,

    async execute(client, message, args) {
        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");
        embed.setTitle(`Alle battlecats die jij hebt gevangen, ${message.author.username}!`);
        embed.setTimestamp();

        await db.getAllBattlecatsFromUser(`${message.author.username}#${message.author.discriminator}`, message.guild.name, (result) => {
            const battlecats = result.sort((a, b) => JSON.parse(a.stats).lvl > JSON.parse(b.stats).lvl ? -1 : 1).map(row => ({name: row.name, value: `Level: ${JSON.parse(row.stats).lvl}\n${JSON.parse(row.stats).rarity}`, inline: true}))

            let chunks = [], size = 9;
            while (battlecats.length > 0) chunks.push(battlecats.splice(0, size));

            if (args.length === 0) args.push("1");
            if (args.join("") > chunks.length || args.join("") <= 0 || !Number.isInteger(parseInt(args.join("")))) return message.reply(`Ongeldige parameter, ben je dom? :nerd:`);

            embed.setFooter({text: `\n\nPagina ${args}/${chunks.length}`});
            embed.addFields(chunks[args - 1]);
            return message.channel.send({embeds: [embed]});
        })
    }
}