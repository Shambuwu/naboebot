module.exports = {
    name: "deploy",
    description: "Register slash commands by posting to Discord API",
    aliases: [],
    showHelp: false,
    utilization: `${client.config.settings.prefix}deploy`,
    slashCommand: false,

    async execute(client, message) {
        const commands = client.commands.filter((command) => command.slashCommand);
        message.guild.commands.set(commands)
            .then(() => {
                message.channel.send(`Deployed commands.`);
            });
    },
}