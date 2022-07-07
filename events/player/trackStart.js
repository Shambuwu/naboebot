const {MessageEmbed} = require("discord.js");

module.exports = (player, queue, track) => {
    const embed = new MessageEmbed();

    embed.setColor("BLURPLE");
    embed.setDescription(`Ik ga deze lijpe track draaien: **${track.title}** in **${queue.connection.channel.name}**.`);
    embed.setTimestamp();

    queue.metadata.send({embeds: [embed]});
}