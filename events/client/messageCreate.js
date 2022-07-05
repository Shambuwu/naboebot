module.exports = (client, message) => {

    function printResult(result){
        console.log(`Executing command by ${message.author}\n
        -> Command: ${cmd.name}\n-> Args: ${args.join(" ")}\n-> Result: ${result ? "success" : "error"}`);
    }

    if(message.author.bot || message.channel.type === "dm") return;
    if(message.content.indexOf("!") !== 0) return;

    // message.channel.send(`**Miauw!** Ik ben nog work in progress helaas, ${message.author.toString()}!`);

    // if(message.content.indexOf(pref) !== 0) return;

    const args = message.content.slice("!".length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (cmd && cmd.voiceChannel) {
        printResult(false);
        if (!message.member.voice.channel) return message.channel.send("Je moet wel in een voice channel zitten... :nerd:");

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`Bro, ${message.author}, ik zit in een andere voice channel...`);
    }

    if(cmd) {
        printResult(true);
        cmd.execute(client, message, args);
    }
}