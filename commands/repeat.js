const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: "repeat",
    description: "Repeats the current track or queue",
    aliases: ["loop"],
    utilization: "!repeat [track / queue]",
    voiceChannel: true,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "OPTIONS: track / queue",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, message, args) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${message.author}...`);

        if (args.join("").toLowerCase() === "queue") {
            if (queue.repeatMode === 1) return message.channel.send(`Er staat al muziek op repeat, schakel dit eerst uit.`);

            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

            return message.channel.send(success ? `Repeat op de queue is **${queue.repeatMode === 0 ? "uitgeschakeld" : 'aangezet'}**.` : `Er is iets fout gegaan, ${message.author}...`);
        } else {
            if (args.join("").toLowerCase() === "track") {
                if (queue.repeatMode === 2) return message.channel.send(`Er staat al muziek op repeat, schakel dit eerst uit.`);

                const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);

                return message.channel.send(success ? `Repeat op **${queue.current.title}** is **${queue.repeatMode === 0 ? "uitgeschakeld" : 'aangezet'}**.` : `Er is iets fout gegaan, ${message.author}...`);
            }
        }

        return message.reply(`Ongeldige parameter, ben je dom?`);
    }
}