const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "skip",
    description: "Skips the current track",
    aliases: ["s"],
    utilization: "!skip",
    voiceChannel: true,
    slashCommand: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te skippen, ${message.author}...`);

        const success = queue.skip();

        const embed = new MessageEmbed();

        embed.setColor("BLURPLE");
        embed.setDescription(success ? `Ik zal dit kut nummer skippen!` : `Er is iets fout gegaan, ${message.author}...`);
        embed.setTimestamp();

        return queue.metadata.send({embeds: [embed]});
    },
}