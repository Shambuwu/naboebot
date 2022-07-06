module.exports = {
    name: "stop",
    description: "Disconnects the player from the voice channel",
    aliases: [],
    utilization: "!stop",
    voiceChannel: true,
    slashCommand: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${message.author}...`);

        queue.stop();

        return message.channel.send(`Stoppen, nu!`);
    }
}
