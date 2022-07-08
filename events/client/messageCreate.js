module.exports = (client, message) => {

    function printResult(result){
        console.log(`Executing command by ${message.author.username}#${message.author.discriminator}\n-> Command: ${cmd.name}\n-> Args: ${args.join(" ")}\n-> Result: ${result ? "success" : "error"}`);
    }

    if(message.author.bot || message.channel.type === "dm") return;
    if(message.content.indexOf(client.config.settings.prefix) !== 0) return;

    const args = message.content.slice("!".length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (cmd && cmd.voiceChannel) {
        if (!message.member.voice.channel){
            printResult(false);
            return message.channel.send("Je moet wel in een voice channel zitten... :nerd:");
        }

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id){
            printResult(false);
            return message.channel.send(`Bro, ${message.author}, ik zit in een andere voice channel...`);
        }
    }

    if(cmd) {
        printResult(true);
        cmd.execute(client, message, args);
    }
}