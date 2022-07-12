module.exports = {
    name: "resume",
    description: "Resumes the player if paused",
    aliases: ["r"],
    utilization: `${client.config.settings.prefix}resume`,
    voiceChannel: true,
    slashCommand: true,

    execute(client, message) {
        const queue = player.getQueue(message.guild.id);

        if (!queue) return message.channel.send(`Er is niks om te resumeren, ${message.author}... :face_with_raised_eyebrow:`);

        const success = queue.setPaused(false);

        return message.channel.send(success ? `Ik zal het huidige nummer, **${queue.current.title}**, voortzetten` : `Er is iets fout gegaan...`);
    },
}