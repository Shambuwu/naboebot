const {MessageEmbed} = require("discord.js");

module.exports = (player, queue) => {
    const embed = new MessageEmbed();

    embed.setColor("BLURPLE");
    embed.setDescription(`Ik heb alle nummers afgespeeld.`);
    embed.setTimestamp();

    queue.metadata.send({embeds: [embed]});
}