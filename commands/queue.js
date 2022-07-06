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

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${message.author}...`);

        const embed = new MessageEmbed();
        embed.setColor("BLURPLE");

        const tracks = queue.tracks.map((track, index) => `${index + 1} - **${track.title}** (aangevraagd door ${track.requestedBy.username})`);

        embed.setDescription(`Huidige nummer: **${queue.current.title}**\n\n${tracks.join("\n")}`);
        embed.setTimestamp();
        
        message.channel.send({embeds: [embed]});
    }
}