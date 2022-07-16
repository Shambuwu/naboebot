const {MessageEmbed} = require("discord.js");
const bcFunctions = require("../../src/bc-functions");

module.exports = {
    name: "list",
    description: "Battlecat list command, use to view your Battlecats",
    aliases: ["l"],
    utilization: `${client.config.settings.prefix}battlecat list [page number]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Which list page you want to view",
            type: "STRING",
            required: false,
        }
    ],

    async execute(client, message, args) {
        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");
        embed.setTitle(`Alle battlecats die jij in bezit hebt, ${message.author.username}!`);
        embed.setTimestamp();

        await db.getAllBattlecatsByUser(message.author.id, message.guild.id, (result) => {
            const battlecats = result.sort((a, b) => JSON.parse(a.stats).lvl > JSON.parse(b.stats).lvl ? -1 : 1).map(row => ({name: row.name, value: `Level: ${JSON.parse(row.stats).lvl}\n${JSON.parse(row.stats).rarity}`, inline: true}))
            battlecats.forEach(cat => {
                let temp = cat.name.split(" ");
                temp = temp.map(name => bcFunctions.capitalizeFirstLetter(name)).join(" ");
                cat.name = temp;
            });

            let chunks = [], size = 9;
            while (battlecats.length > 0) chunks.push(battlecats.splice(0, size));

            if (args.length === 0) args.push("1");
            if (chunks.length === 0) return message.reply(`Het lijkt erop dat je nog geen katten hebt gevangen, ${message.author}...`);
            if (args.join("") > chunks.length || args.join("") <= 0 || !Number.isInteger(parseInt(args.join("")))) return message.reply(`Ongeldige parameter, ben je dom? :nerd:`);

            embed.setFooter({text: `Pagina ${args}/${chunks.length}`});
            embed.addFields(chunks[args - 1]);
            return message.channel.send({embeds: [embed]});
        })
    }
}