const {MessageEmbed} = require("discord.js");

module.exports = async (player, queue, track) => {
    const embed = new MessageEmbed();

    embed.setColor("BLURPLE");
    embed.setThumbnail(track.thumbnail);
    embed.setDescription(`Ik ga deze lijpe track draaien: **${track.title}** in **${queue.connection.channel.name}**.`);
    embed.setTimestamp();

    queue.metadata.send({embeds: [embed]});

    await db.insert(track.title, track.url, `${track.requestedBy.username}#${track.requestedBy.discriminator}`, queue.guild.name);
}