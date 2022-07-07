const {MessageEmbed} = require("discord.js");

module.exports = (player, queue, track) => {
    const embed = new MessageEmbed();

    embed.setColor("BLURPLE");
    embed.setDescription(`Ik heb het deuntje **${track.title}** toegevoegd aan de wachtrij!`);
    embed.setTimestamp();

    queue.metadata.send({embeds: [embed]});
}