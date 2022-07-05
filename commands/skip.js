module.exports = {
    name: "skip",
    aliases: ["s"],
    utilization: "{prefix}skip",
    voiceChannel: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te skippen, ${message.author}...`);

        const success = queue.skip();

        return message.channel.send(success ? `Ik zal dit kut nummer skippen!` : `Er is iets fout gegaan, ${message.author}...`);
    },
}