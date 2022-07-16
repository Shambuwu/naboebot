const {MessageEmbed} = require("discord.js");
const bcFunctions = require("../../src/bc-functions.js");

module.exports = {
    name: "inspect",
    description: "Battlecat inspect command, use to view a specific Battlecats",
    aliases: ["i"],
    utilization: `${client.config.settings.prefix}battlecat inspect`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Name of the Battlecat you wish to view",
            type: "STRING",
            required: false,
        }
    ],

    async execute(client, message, args) {
        if(args.length === 0) return message.reply(`Geef de naam van een Battlecat mee om deze te inspecteren, ${message.author}...`);

        const bcName = args.join(" ").toLowerCase();


        db.getBattlecatByName(bcName, message.author.id, message.guild.id).then(result => {
            if(result.length === 0) return message.reply(`Deze kat is niet in jouw bezit...`);

            let name = result[0].name.split(" ");
            name = name.map(name => bcFunctions.capitalizeFirstLetter(name)).join(" ");

            const stats = JSON.parse(result[0].stats)
            const embed = new MessageEmbed();

            embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
            embed.setTimestamp();
            embed.setTitle(name);
            embed.addFields(Object.keys(stats).map(stat => ({name: stat.toUpperCase(), value: stats[stat].toString(), inline: true})));
            embed.addField("Gevangen op:", result[0].time.toString().replace(" ", "\n"));
            embed.setImage(result[0].thumbnail);
            embed.setColor(client.battlecats.rarities[stats.rarity.toLowerCase().replace(" ", "_")].color);

            return message.reply({embeds: [embed]});
        });
    }
}