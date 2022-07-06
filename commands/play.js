const { QueryType } = require("discord-player");

module.exports = {
    name: "play",
    description: "Plays a track by querying a title or URL",
    aliases: ["p"],
    utilization: "!play [titel / URL]",
    voiceChannel: true,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Song you want to query",
            type: "STRING",
            required: true,
        }
    ],

    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(`Ben je nou echt zo dom, of doe je alsof ${message.author}...? :nerd:`);

        const result = await player.search(args.join(" "), {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        });

        if(!result || !result.tracks.length) return message.channel.send(`Bro, ik kan geen resultaten vinden voor deze query: ${args.join(" ")}...`);


        const queue = await player.createQueue(message.guild, {
            metadata: message.channel,
            ytdlOptions: {
                filter: 'audioonly',
                quality: "highestaudio",
                highWaterMark: 1 << 30,
                dlChunkSize: 0,
            },
            leaveOnEnd: false,
            leaveOnEmptyCooldown: 10000,
        })

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            await player.deleteQueue(message.guild.id);
            return message.channel.send(`Ik kom de voice channel niet in ofzo? Kankerzooi.`);
        }

        // await message.channel.send(`Ik ben je liedje aan het laden hoor... :heart:`);

        result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

        if (!queue.playing) await queue.play();
    },
}