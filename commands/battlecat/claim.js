const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "claim",
    description: "Battlecat claim command, use to claim a Battlecat",
    aliases: ["c"],
    utilization: `${client.config.settings.prefix}battlecat claim [name]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Name of the Battlecat you want to claim.",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, message, args) {
        let battlecat = message.guild.currentBattlecat;

        if (battlecat === null || battlecat === undefined) return message.reply(`Er is niets om te vangen, ${message.author}...`);

        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");
        embed.setTitle(`**${battlecat.name}** gevangen!`);
        embed.addFields(Object.keys(battlecat.stats).map((stat) => ({name: stat.toUpperCase(), value: battlecat.stats[stat].toString(), inline: true})));
        embed.setThumbnail(battlecat.thumbnail);
        embed.setTimestamp();

        if (battlecat.name.toLowerCase() === args.join(" ").toLowerCase()) {
            await db.insertBattlecat(battlecat.name.toLowerCase(), battlecat.thumbnail, JSON.stringify(battlecat.stats), message.author.id, message.guild.id);
            clearTimeout(message.guild.currentTimeout);
            message.guild.currentBattlecat = null;
            return message.reply({embeds: [embed]});
        }
    }
}