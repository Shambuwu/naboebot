module.exports = (client, message) => {
    if(message.author.bot || message.channel.type === "dm") return;
    if(message.content.indexOf("!") !== 0) return;

    message.channel.send(`**Miauw!** Ik ben nog work in progress helaas, ${message.author.toString()}!`);

    // if(message.content.indexOf(pref) !== 0) return;

    const args = message.content.slice("!".length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

}