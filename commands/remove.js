const {Interaction, MessageEmbed} = require("discord.js");

module.exports = {
    name: "remove",
    description: "Removes a track from the queue",
    aliases: ["delete", "destroy"],
    utilization: "!remove [index]",
    voiceChannel: true,
    slashCommand: true,
    options: [
        {
            name: "query",
            description: "Song you want to remove by index",
            type: "STRING",
            required: true,
        }
    ],

    execute(client, command, args) {
        const queue = player.getQueue(command.guild.id);
        const author = command instanceof Interaction ? command.user : command.author;
        const argsInt = parseInt(args.join(""));

        if (!queue || !queue.playing) return command.channel.send(`Er zit niks in de queue, ${author}...`);
        if (!Number.isInteger(argsInt) || argsInt > queue.tracks.length || argsInt <= 0) return command.channel.send(`Ongeldige parameter, ${author}...`);

        const trackToRemove = queue.tracks[argsInt - 1];
        const success = queue.remove(trackToRemove);
        const embed = new MessageEmbed();

        embed.setColor("BLURPLE");
        embed.setDescription(`Ik heb het deuntje **${trackToRemove.title}** verwijderd uit de wachtrij!`);
        embed.setTimestamp();

        return command.channel.send(success ? {embeds: [embed]} : `Er is iets fout gegaan...`);
    }
}