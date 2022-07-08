const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "queue",
    description: "Shows the current queue",
    aliases: ["q"],
    utilization: "!queue",
    voiceChannel: true,
    slashCommand: true,

    async execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij zit er niks in de queue, ${message.author}...`);

        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");

        const tracks = queue.tracks.map((track, index) => `${index + 1} - **${track.title}** (aangevraagd door ${track.requestedBy.username})`);

        embed.setDescription(`Huidige nummer: **${queue.current.title}**\n\n${tracks.join("\n")}`);
        embed.setThumbnail(queue.current.thumbnail);
        embed.setTimestamp();

        message.channel.send({embeds: [embed]});
    }
}