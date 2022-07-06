module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    aliases: [],
    utilization: "!shuffle",
    voiceChannel: true,
    slashCommand: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${message.author}...`);

        queue.shuffle();

        return message.channel.send(`Lekker schuifelen! :musical_note:`);
    }
}