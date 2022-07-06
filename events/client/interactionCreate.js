module.exports = (client, interaction) => {

    let args;

    try {
        args = interaction.options._hoistedOptions[0].value.split(",");
    } catch {
        args = [];
    }

    function printResult(result){
        console.log(`Executing command by ${interaction.user.username}#${interaction.user.discriminator}\n-> Command: ${cmd.name}\n-> Args: ${args.join(" ")}\n-> Result: ${result ? "success" : "error"}`);
    }

    if (!interaction.isCommand() || !interaction.guildId) return console.log("Invalid interaction!");

    const command = interaction.commandName;

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (cmd && cmd.voiceChannel) {
        printResult(false);
        if (!interaction.member.voice.channel) return interaction.channel.send("Je moet wel in een voice channel zitten... :nerd:");

        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.channel.send(`Bro, ${interaction.user}, ik zit in een andere voice channel...`);
    }

    if(cmd) {
        printResult(true);
        cmd.execute(client, interaction, args);
        interaction.reply("Ok!");
    }
}