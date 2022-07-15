module.exports = (client, message) => {
    function printResult(result){
        console.log(`Executing command by ${message.author.username}#${message.author.discriminator} in ${message.guild.name}\n-> Command: ${cmd.name}\n-> Args: ${args.join(" ")}\n-> Result: ${result ? "success" : "error"}`);
    }

    if(message.author.bot || message.channel.type === "dm") return;
    if(message.guild.counter !== undefined){
        message.guild.counter++
    } else {
        message.guild.counter = 1;
    }

    if(message.content.toLowerCase().includes("jdvkm")){
        client.users.cache.get("236899263513231362").send(`Gebruiker **${message.author.username}#${message.author.discriminator}** heeft het J-woord gezegd op **${new Date()}** in **${message.guild.name}** - **${message.channel.name}**`);
        return message.reply("Wat zei jij daar!?");
    }
    if(message.content.toLowerCase().includes("douwe") && message.author.id === "236899263513231362"){
        return message.reply("Chris***");
    }

    const bc = client.commands.get("battlecat");
    if(message.guild.counter === 25) {
        message.guild.counter = 0;
        bc.spawncat(client, message).then((r) => console.log(`-> Battlecat has spawned in ${message.guild.name}`));
    }

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
        try {
            cmd.execute(client, message, args);
            printResult(true);
        } catch (err) {
            printResult(false);
            console.log(`-> ${err}`);
            client.users.cache.get("236899263513231362").send(`Error in **${message.guild.name}**: ${err}\nTijd: ${new Date()}`);
        }
    }
}