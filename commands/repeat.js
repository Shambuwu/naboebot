const { QueueRepeatMode } = require('discord-player');
const {MessageEmbed, Interaction} = require("discord.js");

module.exports = {
    name: "repeat",
    description: "Repeats the current track or queue",
    aliases: ["loop"],
    utilization: "!repeat ['track' / 'queue']",
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

    async execute(client, command, args) {
        const queue = player.getQueue(command.guild.id);
        const author = command instanceof Interaction ? command.user : command.author;

        if (!queue || !queue.playing) return command.channel.send(`Misschien ligt het aan mij, maar volgens mij valt er niet zoveel te stoppen, ${author}...`);

        if (args.join("").toLowerCase() === "queue") {
            if (queue.repeatMode === 1) return command.channel.send(`Er staat al muziek op repeat, schakel dit eerst uit.`);

            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

            const embed = new MessageEmbed();

            embed.setColor("BLURPLE");
            embed.setDescription(`Repeat op de queue is **${queue.repeatMode === 0 ? "uitgeschakeld" : 'aangezet'}**.`);
            embed.setTimestamp();

            return command.channel.send(success ? {embeds: [embed]} : `Er is iets fout gegaan, ${author}...`);
        } else {
            if (args.join("").toLowerCase() === "track") {
                if (queue.repeatMode === 2) return command.channel.send(`Er staat al muziek op repeat, schakel dit eerst uit.`);

                const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);

                const embed = new MessageEmbed();

                embed.setColor("BLURPLE");
                embed.setDescription(`Repeat op **${queue.current.title}** is **${queue.repeatMode === 0 ? "uitgeschakeld" : 'aangezet'}**.`);
                embed.setTimestamp();

                return command.channel.send(success ? {embeds: [embed]} : `Er is iets fout gegaan, ${author}...`);
            }
        }

        return command.channel.send(`Ongeldige parameter, ben je dom?`);
    }
}