module.exports = {
    name: "clear",
    description: "Clears the entire queue",
    aliases: [],
    utilization: `${client.config.settings.prefix}clear`,
    voiceChannel: true,
    slashCommand: true,

    async execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${message.author}...`);

        await queue.clear();

        message.channel.send("Ik heb de wachtrij opgeschoond, ${message.author} :3")
    }
}