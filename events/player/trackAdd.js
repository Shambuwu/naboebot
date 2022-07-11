const {MessageEmbed} = require("discord.js");

module.exports = async (player, queue, track) => {
    const embed = new MessageEmbed();

    embed.setColor("BLURPLE");
    embed.setDescription(`Ik heb het deuntje **${track.title}** toegevoegd aan de wachtrij!`);
    embed.setTimestamp();

    queue.metadata.send({embeds: [embed]});

    await db.insert(track.title, track.url, `${track.requestedBy.username}#${track.requestedBy.discriminator}`, queue.guild.name);
}