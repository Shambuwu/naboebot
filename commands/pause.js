module.exports = {
    name: "pause",
    aliases: [],
    utilization: "pause",
    voiceChannel: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send(`Er is niks om te pauzeren, ${message.author}... :face_with_raised_eyebrow:`);

        const success = queue.setPaused(true);

        return message.channel.send(success ? `Ik zal het huidige nummer, **${queue.current.title}** pauzeren!` : `Er is iets fout gegaan...`);
    }
}