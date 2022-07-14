const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "claim",
    description: "Battlecat claim command, use to claim a battlecat",
    aliases: ["c"],
    utilization: `${client.config.settings.prefix}battlecat claim [name]`,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Name of the battlecat you want to claim.",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, message, args) {
        let battlecat = client.battlecats.current;

        if (battlecat === null || battlecat === undefined) return message.reply(`Er is niets om te vangen, ${message.author}...`);

        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");
        embed.setTitle(`**${battlecat.name}** gevangen!`);
        embed.addFields(Object.keys(battlecat.stats).map((stat) => ({name: stat.toUpperCase(), value: battlecat.stats[stat].toString(), inline: true})));
        embed.setThumbnail(battlecat.thumbnail);
        embed.setTimestamp();

        if (battlecat.name.toLowerCase() === args.join(" ").toLowerCase()) {
            await db.insertBattlecat(battlecat.name, battlecat.thumbnail, JSON.stringify(battlecat.stats), `${message.author.username}#${message.author.discriminator}`, message.guild.name);
            client.battlecats.current = null;
            return message.reply({embeds: [embed]});
        }
    }
}