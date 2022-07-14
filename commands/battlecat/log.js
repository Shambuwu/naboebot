module.exports = {
    name: "log",
    description: "Dev log command",
    aliases: [],
    utilization: `${client.config.settings.prefix}battlecat log`,
    showHelp: false,

    async execute(client, message, args) {
        console.log(client.guilds.cache.map(guild => ({name: guild.name, battlecat: guild?.currentBattlecat})));
        message.reply(`${message.guild.name}: ${message.guild.currentBattlecat?.name}\nTimeout: ${message.guild?.currentTimeout}`);
    }
}