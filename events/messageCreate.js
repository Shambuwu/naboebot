module.exports = (client, message) => {
    if(message.author.bot || message.channel.type === "dm") return;

    const prefix = client.config.prefix;

    if(message.content.indexOf(prefix) !== 0) return;

    message.channel.send("prefix test");
}