const {MessageEmbed} = require("discord.js");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: "inspect",
    description: "Battlecat list command, use to view your battlecats",
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

        const embed = new MessageEmbed();
        embed.setFooter({text: `(Deze functionaliteit is nog work in progress)`});
        embed.setTimestamp();

        const bcName = args.map(arg => capitalizeFirstLetter(arg.toLowerCase())).join(" ");


        await db.getBattlecatByname(bcName, `${message.author.username}#${message.author.discriminator}`, message.guild.name, (result) => {
            if(result.length === 0) return message.reply(`Deze kat is niet in jouw bezit...`);

            const stats = JSON.parse(result[0].stats)

            embed.setTitle(result[0].name);
            embed.addFields(Object.keys(stats).map(stat => ({name: stat.toUpperCase(), value: stats[stat].toString(), inline: true})));
            embed.setImage(result[0].thumbnail);
            embed.setColor(client.battlecats.rarities[stats.rarity.toLowerCase().replace(" ", "_")].color);

            return message.channel.send({embeds: [embed]});
        })
    }
}